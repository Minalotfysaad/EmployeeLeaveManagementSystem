using AutoMapper;
using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.DTOs.Balance;
using EmployeeLeaveManagement.Application.Exceptions;
using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Infrastructure.Persistence.Specifications;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public class BalanceService(
        IUnitOfWork _unitOfWork,
        IMapper _mapper,
        IValidator<UpdateBalanceDto> _updateValidator)
        : IBalanceService
    {
        public async Task<List<BalanceDto>> GetBalancesAsync(Guid employeeId)
        {
            await CheckEmployeeExistsAsync(employeeId);
            var repository = _unitOfWork.Repository<EmployeeLeaveBalance>();
            var specification = new EmployeeLeaveBalanceSpecification(employeeId);
            var balances = await repository.ListAsync(specification)
                ?? throw new NotFoundException(nameof(EmployeeLeaveBalance), employeeId);

            return _mapper.Map<List<BalanceDto>>(balances);
        }

        public async Task<BalanceDto> GetBalanceAsync(Guid employeeId, Guid leaveTypeId)
        {
            await CheckEmployeeExistsAsync(employeeId);
            var repository = _unitOfWork.Repository<EmployeeLeaveBalance>();
            var specification = new EmployeeLeaveBalanceSpecification(employeeId, leaveTypeId);
            var balance = await repository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(EmployeeLeaveBalance), leaveTypeId);

            return _mapper.Map<BalanceDto>(balance);

        }

        public async Task UpdateBalanceAsync(Guid employeeId, Guid leaveTypeId, UpdateBalanceDto dto)
        {
            //Validate DTO
            var validation = await _updateValidator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                throw new BadRequestException(
                     validation.Errors
                         .Select(e => e.ErrorMessage)
                         .ToList());
            }
            //Check Employee Exists
            await CheckEmployeeExistsAsync(employeeId);

            //Load
            var repository = _unitOfWork.Repository<EmployeeLeaveBalance>();
            var specification = new EmployeeLeaveBalanceSpecification(employeeId, leaveTypeId);
            var balance =await repository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(EmployeeLeaveBalance), leaveTypeId);

            //Update
            balance.RemainingDays = dto.RemainingDays;

            //Save
            await _unitOfWork.SaveChangesAsync();
        }

        #region Helpers
        private async Task CheckEmployeeExistsAsync(Guid employeeId)
        {
            var employeeRepository = _unitOfWork.Repository<Employee>();
            var exists = await employeeRepository.AnyAsync(new EmployeeByIdSpecification(employeeId));

            if (!exists)
            {
                throw new NotFoundException(nameof(Employee), employeeId);
            }
        } 
        #endregion
    }
}
