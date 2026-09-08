using AutoMapper;
using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.LeaveType;
using EmployeeLeaveManagement.Application.Exceptions;
using EmployeeLeaveManagement.Application.Validators.LeaveType;
using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Infrastructure.Persistence.Repositories;
using EmployeeLeaveManagement.Infrastructure.Persistence.Specifications;
using FluentValidation;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Model;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public class LeaveTypeService(
        IUnitOfWork _unitOfWork,
        IMapper _mapper,
        ILogger<LeaveTypeService> _logger,
        IValidator<CreateLeaveTypeDto> _createValidator,
        IValidator<UpdateLeaveTypeDto> _updateValidator)
        : ILeaveTypeService
    {
        public async Task<PagedResult<LeaveTypeSummaryDto>> GetAllAsync(EmployeeQueryParameters parameters)
        {
            var repository = _unitOfWork.Repository<LeaveType>();
            var specification = new LeaveTypeListSpecification(parameters);
            var leaveTypes = await repository.ListAsync(specification);
            var totalCount = await repository.CountAsync(specification);

            var dto = _mapper.Map<List<LeaveTypeSummaryDto>>(leaveTypes);

            return PagedResult<LeaveTypeSummaryDto>.Create(
                dto,
                parameters.Page,
                parameters.PageSize,
                totalCount);
        }

        public async Task<LeaveTypeDetailsDto> GetByIdAsync(Guid id)
        {
            var repository = _unitOfWork.Repository<LeaveType>();
            var specification = new LeaveTypeByIdSpecification(id);
            var leaveType = await repository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(LeaveType), id);
                
            return _mapper.Map<LeaveTypeDetailsDto>(leaveType);
        }

        public async Task<LeaveTypeDetailsDto> CreateAsync(CreateLeaveTypeDto dto)
        {
            //Validate
            var validation = await _createValidator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                throw new BadRequestException(validation.Errors
                    .Select(e  => e.ErrorMessage)
                    .ToList());
            }

            // Normalize
            var name = dto.Name.Trim();

            // Duplicate Check
            var repository = _unitOfWork.Repository<LeaveType>();
            var duplicateSpecification = new LeaveTypeDuplicateSpecification(name);
            if(await repository.AnyAsync(duplicateSpecification))
            {
                throw new BadRequestException("A leave type with the same name already exists.");
            }

            //Map
            var leavetype = _mapper.Map<LeaveType>(dto);
            leavetype.Name = name;

            //Save
            await repository.AddAsync(leavetype);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Leave type created. LeaveTypeId: {LeaveTypeId}, Name: {LeaveTypeName}",
            leavetype.Id,
            leavetype.Name);

            //Return
            return _mapper.Map<LeaveTypeDetailsDto>(leavetype);

        }

        public async Task UpdateAsync(Guid id, UpdateLeaveTypeDto dto)
        {
            // Validate
            var validation = await _updateValidator.ValidateAsync(dto);

            if (!validation.IsValid)
            {
                throw new BadRequestException(validation.Errors
                        .Select(e => e.ErrorMessage)
                        .ToList());
            }

            var repository = _unitOfWork.Repository<LeaveType>();

            // Load existing leave type
            var leaveType = await repository.FirstOrDefaultAsync(new LeaveTypeByIdSpecification(id))
                ?? throw new NotFoundException(nameof(LeaveType), id);

            // Normalize
            var name = dto.Name.Trim();

            // Duplicate check
            var duplicateSpecification =new LeaveTypeDuplicateSpecification(id, name);

            if (await repository.AnyAsync(duplicateSpecification))
                throw new BadRequestException( "A leave type with the same name already exists.");

            // Update tracked entity
            leaveType.Name = name;
            leaveType.Description = dto.Description;
            leaveType.DefaultDays = dto.DefaultDays;

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Leave type updated. LeaveTypeId: {LeaveTypeId}, Name: {LeaveTypeName}",
            leaveType.Id,
            leaveType.Name);
        }

        public async Task DeleteAsync(Guid id)
        {
            //Load leave type
            var repository = _unitOfWork.Repository<LeaveType>();
            var leaveType = await repository.FirstOrDefaultAsync(
                new LeaveTypeByIdSpecification(id))
                    ?? throw new NotFoundException(nameof(LeaveType), id);

            //Check if it's in use
            //1. Check EmployeeLeaveBalance
            var balanceRepository = _unitOfWork.Repository<EmployeeLeaveBalance>();
            var leaveBalanceSpecification = new EmployeeLeaveBalanceByLeaveTypeSpecification(id);
            var hasBalance = await balanceRepository.AnyAsync(leaveBalanceSpecification);

            //2. Check LeaveRequest
            var requestRepository = _unitOfWork.Repository<LeaveRequest>();
            var leaveRequestSpecification = new LeaveRequestByLeaveTypeSpecification(id);
            var hasRequests = await requestRepository.AnyAsync(leaveRequestSpecification);

            if(hasBalance || hasRequests)
            {
                throw new BadRequestException("Cannot delete a leave type that is already in use.");
            }

            var leaveTypeName = leaveType.Name;

            //Remove
            repository.Remove(leaveType);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Leave type deleted. LeaveTypeId: {LeaveTypeId}, Name: {LeaveTypeName}",
                leaveType.Id,
                leaveTypeName);
        }
    }
}
