using AutoMapper;
using Leavo.Application.Abstractions.Caching;
using Leavo.Application.Abstractions.Persistence;
using Leavo.Application.Abstractions.Services;
using Leavo.Application.Common.Models;
using Leavo.Application.Common.Models.Caching;
using Leavo.Application.DTOs.Department;
using Leavo.Application.DTOs.Employee;
using Leavo.Application.Exceptions;
using Leavo.Domain.Entities;
using Leavo.Infrastructure.Persistence.Specifications;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Services
{
    public class DepartmentService(
        IUnitOfWork _unitOfWork,
        ICacheService _cacheService,
        IMapper _mapper,
        IValidator<CreateDepartmentDto> _createValidator,
        IValidator<UpdateDepartmentDto> _updateValidator)
        : IDepartmentService
    {
        public async Task<PagedResult<DepartmentDetailsDto>> GetAllAsync(EmployeeQueryParameters parameters)
        {
            var repository = _unitOfWork.Repository<Department>();
            var specification =new DepartmentListSpecification(parameters);
            var departments = await repository.ListAsync(specification);
            var totalCount = await repository.CountAsync(specification);

            var dto = _mapper.Map<List<DepartmentDetailsDto>>(departments);

            return PagedResult<DepartmentDetailsDto>.Create(
                dto,
                parameters.Page,
                parameters.PageSize,
                totalCount);
        }

        public async Task<DepartmentDetailsDto> GetByIdAsync(Guid id)
        {
            var repository = _unitOfWork.Repository<Department>();
            var department = await repository.FirstOrDefaultAsync(new DepartmentByIdSpecification(id))
                ?? throw new NotFoundException(nameof(Department), id);

            return _mapper.Map<DepartmentDetailsDto>(department);
        }

        public async Task<DepartmentDetailsDto> CreateAsync(CreateDepartmentDto dto)
        {
            // Validate
            var validation = await _createValidator.ValidateAsync(dto);

            if (!validation.IsValid)
            {
                throw new BadRequestException(
                    validation.Errors
                        .Select(e => e.ErrorMessage)
                        .ToList());
            }

            // Normalize
            var name = dto.Name.Trim();

            var repository = _unitOfWork.Repository<Department>();

            // Duplicate check
            var duplicateSpecification =new DepartmentDuplicateSpecification(name);

            if (await repository.AnyAsync(duplicateSpecification))
                throw new BadRequestException( "A department with the same name already exists.");

            // Map
            var department = _mapper.Map<Department>(dto);
            department.Name = name;

            // Save
            await repository.AddAsync(department);
            await _unitOfWork.SaveChangesAsync();
            await _cacheService.RemoveAsync(CacheKeys.HRDashboard);

            return _mapper.Map<DepartmentDetailsDto>(
                department);
        }

        public async Task UpdateAsync(Guid id, UpdateDepartmentDto dto)
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

            var repository = _unitOfWork.Repository<Department>();

            // Load
            var department = await repository.FirstOrDefaultAsync(new DepartmentByIdSpecification(id))
                ?? throw new NotFoundException(nameof(Department), id);

            // Normalize
            var name = dto.Name.Trim();

            // Duplicate check
            var duplicateSpecification =
                new DepartmentDuplicateSpecification(id, name);

            if (await repository.AnyAsync(duplicateSpecification))
                throw new BadRequestException( "A department with the same name already exists.");

            // Update 
            department.Name = name;

            //Save
            await _unitOfWork.SaveChangesAsync();
            await _cacheService.RemoveAsync(CacheKeys.HRDashboard);
        }

        public async Task DeleteAsync(Guid id)
        {
            var repository = _unitOfWork.Repository<Department>();

            // Load
            var department = await repository.FirstOrDefaultAsync(new DepartmentByIdSpecification(id))
                ?? throw new NotFoundException(nameof(Department), id);

            // Check employees
            var employeeRepository = _unitOfWork.Repository<Employee>();
            var hasEmployees = await employeeRepository.AnyAsync(new DepartmentHasEmployeesSpecification(id));

            if (hasEmployees)
                throw new BadRequestException("Cannot delete a department that has employees assigned to it.");

            // Remove
            repository.Remove(department);

            await _unitOfWork.SaveChangesAsync();
            await _cacheService.RemoveAsync(CacheKeys.HRDashboard);
        }
    }
}
