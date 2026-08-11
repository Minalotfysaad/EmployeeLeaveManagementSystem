using AutoMapper;
using EmployeeLeaveManagement.Application.Abstractions.Caching;
using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.Common.Models.Caching;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.Holiday;
using EmployeeLeaveManagement.Application.Exceptions;
using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Infrastructure.Persistence.Specifications;
using FluentValidation;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public class HolidayService(
        IUnitOfWork _unitOfWork,
        ICacheService _cacheService,
        IMapper _mapper,
        ILogger<HolidayService> _logger,
        IValidator<CreateHolidayDto> _createValidator,
        IValidator<UpdateHolidayDto> _updateValidator)
        : IHolidayService
    {
        public async Task<PagedResult<HolidaySummaryDto>> GetAllAsync(EmployeeQueryParameters parameters)
        {
            var repository = _unitOfWork.Repository<Holiday>();
            var specification = new HolidayListSpecification(parameters);
            var holidays = await repository.ListAsync(specification);
            var totalCount = await repository.CountAsync(specification);

            var dto = _mapper.Map<List<HolidaySummaryDto>>(holidays);
            return PagedResult<HolidaySummaryDto>.Create(
                dto,
                parameters.Page,
                parameters.PageSize,
                totalCount);
        }

        public async Task<HolidayDetailsDto> GetByIdAsync(Guid id)
        {
            var repository = _unitOfWork.Repository<Holiday>();
            var specification = new HolidayByIdSpecification(id);
            var holiday = await repository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(Holiday), id);

            return _mapper.Map<HolidayDetailsDto>(holiday);
        }

        public async Task<HolidayDetailsDto> CreateAsync(Guid hrId, CreateHolidayDto dto)
        {
            var validation = await _createValidator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                throw new BadRequestException(
                    validation.Errors
                        .Select(e => e.ErrorMessage)
                        .ToList());
            }

            var repository = _unitOfWork.Repository<Holiday>();
            var duplicateSpecification = new HolidayDuplicateSpecification(
                dto.Name,
                dto.StartDate,
                dto.EndDate);

            var duplicateCheck = await repository.AnyAsync(duplicateSpecification);
            if(duplicateCheck)
            {
                throw new BadRequestException("Holiday already exists.");
            }

            var holiday = _mapper.Map<Holiday>(dto);
            holiday.CreatedById = hrId;

            await repository.AddAsync(holiday);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
            "Holiday created. HolidayId: {HolidayId}, CreatedBy: {CreatedBy}",
            holiday.Id,
            hrId);

            await _cacheService.RemoveAsync(CacheKeys.HRDashboard);

            holiday = await repository.FirstOrDefaultAsync(new HolidayByIdSpecification(holiday.Id))
                ?? throw new InvalidOperationException("Failed to reload holiday after creation.");

            return _mapper.Map<HolidayDetailsDto>(holiday); 

        }

        public async Task UpdateAsync(Guid id, UpdateHolidayDto dto)
        {
            // Validate
            var validation = await _updateValidator.ValidateAsync(dto);

            if (!validation.IsValid)
            {
                throw new BadRequestException(
                    validation.Errors
                        .Select(e => e.ErrorMessage)
                        .ToList());
            }

            var repository = _unitOfWork.Repository<Holiday>();

            // Load
            var holiday = await repository.FirstOrDefaultAsync(
                new HolidayByIdSpecification(id))
                ?? throw new NotFoundException(nameof(Holiday), id);

            // Business Rule
            if (holiday.StartDate <= DateTime.UtcNow)
            {
                throw new BadRequestException(
                    "Cannot update holidays that have already started.");
            }

            // Duplicate Check
            var duplicateSpecification = new HolidayDuplicateSpecification(
                id,
                dto.Name,
                dto.StartDate,
                dto.EndDate);

            if (await repository.AnyAsync(duplicateSpecification))
                throw new BadRequestException("Another holiday with the same name and dates already exists.");

            // Update
            holiday.Name = dto.Name;
            holiday.StartDate = dto.StartDate;
            holiday.EndDate = dto.EndDate;

            // Save
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Holiday updated. HolidayId: {HolidayId}", id);

            await _cacheService.RemoveAsync(CacheKeys.HRDashboard);
        }

        public async Task DeleteAsync(Guid id)
        {
            var repository = _unitOfWork.Repository<Holiday>();
            var specification = new HolidayByIdSpecification(id);
            var holiday = await repository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(Holiday), id);

            if (holiday.StartDate <= DateTime.UtcNow)
                throw new BadRequestException("Cannot delete holidays that have already started.");

            repository.Remove(holiday);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Holiday deleted. HolidayId: {HolidayId}", id);

            await _cacheService.RemoveAsync(CacheKeys.HRDashboard);

        }
    }
}
