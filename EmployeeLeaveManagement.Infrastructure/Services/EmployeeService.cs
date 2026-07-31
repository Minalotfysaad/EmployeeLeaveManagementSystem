using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using EmployeeLeaveManagement.Application.Common.Models;
using Microsoft.AspNetCore.Identity;
using EmployeeLeaveManagement.Domain.Entities;
using AutoMapper;
using FluentValidation;
using EmployeeLeaveManagement.Domain.Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Infrastructure.Persistence.Specifications;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public class EmployeeService(
        IUnitOfWork _unitOfWork,
        IMapper _mapper,
        IValidator<UpdateEmployeeDto> _updateValidator
        ) : IEmployeeService
    {

        public async Task<EmployeeDetailsDto> GetEmployeeByIdAsync(Guid id)
        {
            var repository = _unitOfWork.Repository<Employee>();
            var specification = new EmployeeByIdSpecification(id);
            var employee = await repository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(Employee), id);
            var dto = _mapper.Map<EmployeeDetailsDto>(employee);

            return dto;

        }

        public async Task<PagedResult<EmployeeSummaryDto>> GetEmployeesAsync(EmployeeQueryParameters parameters)
        {
            var repository = _unitOfWork.Repository<Employee>();
            var specification = new EmployeeSpecification(parameters);
            var employees = await repository.ListAsync(specification); 
            var totalCount = await repository.CountAsync(specification);
            var dto = _mapper.Map<List<EmployeeSummaryDto>>(employees);

            return PagedResult<EmployeeSummaryDto>
                .Create(dto, parameters.Page, parameters.PageSize, totalCount);

        }

        public async Task UpdateEmployeeAsync(Guid id, UpdateEmployeeDto dto)
        {
            //Validate DTO
            var validationResult = await _updateValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new BadRequestException(validationResult.Errors.Select(e => e.ErrorMessage).ToList());
            }

            var repository = _unitOfWork.Repository<Employee>();
            var specification = new EmployeeByIdSpecification(id);
            var employee = await repository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(Employee), id);
            
            //Update
            _mapper.Map(dto, employee);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteEmployeeAsync(Guid id)
        {
            var repository = _unitOfWork.Repository<Employee>();
            var specification = new EmployeeByIdSpecification(id);
            var employee = await repository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(Employee), id);

            repository.Remove(employee);

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
