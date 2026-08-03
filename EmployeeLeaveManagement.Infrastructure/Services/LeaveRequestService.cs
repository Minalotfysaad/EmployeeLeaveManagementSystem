using AutoMapper;
using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.LeaveRequest;
using EmployeeLeaveManagement.Application.Exceptions;
using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Domain.Enums;
using EmployeeLeaveManagement.Infrastructure.Persistence.Specifications;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public class LeaveRequestService(IUnitOfWork _unitOfWork,
        IMapper _mapper,
        IValidator<CreateLeaveRequestDto> _createValidator)
        : ILeaveRequestService
    {
        public async Task<LeaveRequestDetailsDto> CreateLeaveRequestAsync(Guid employeeId, CreateLeaveRequestDto dto)
        {
            //Validate CreateLeaveRequestDto
            var validationResult = await _createValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new BadRequestException(
                    validationResult.Errors
                        .Select(e => e.ErrorMessage)
                        .ToList());
            }

            //Check Leave Type exists
            var leaveTypeRepository = _unitOfWork.Repository<LeaveType>();
            var leaveTypeSpecification = new LeaveTypeByIdSpecification(dto.LeaveTypeId);
            _ = await leaveTypeRepository.FirstOrDefaultAsync(leaveTypeSpecification)
                ?? throw new NotFoundException(nameof(LeaveType), dto.LeaveTypeId);

            //Check Leave Balance
            var balanceRepository = _unitOfWork.Repository<EmployeeLeaveBalance>();
            var balanceSpecification = new EmployeeLeaveBalanceSpecification(employeeId, dto.LeaveTypeId);

            var balance = await balanceRepository.FirstOrDefaultAsync(balanceSpecification)
                ?? throw new BadRequestException("The employee has no leave balance for this leave type.");

            var requestedDays = (dto.EndDate.DayNumber - dto.StartDate.DayNumber) + 1;
            if(requestedDays > balance.RemainingDays)
            {
                throw new BadRequestException("Insufficient leave balance.");
            }

            //Check Overlap
            var leaveRequestRepository = _unitOfWork.Repository<LeaveRequest>();
            var overlapSpecification = new LeaveRequestOverlapSpecification(employeeId, dto.StartDate, dto.EndDate);
            var hasOverlap = await leaveRequestRepository.AnyAsync(overlapSpecification);
            if (hasOverlap)
                throw new BadRequestException("The requested leave period overlaps with an existing leave request.");


            //Map DTO => Entity
            var leaveRequest = _mapper.Map<LeaveRequest>(dto);

            //Set rest of properties
            leaveRequest.EmployeeId = employeeId;
            leaveRequest.Status = RequestStatus.Pending;
            leaveRequest.CalculateTotalDays();

            //Save
            await leaveRequestRepository.AddAsync(leaveRequest);

            await _unitOfWork.SaveChangesAsync();

            //Return LeaveRequestDetailsDto
            return _mapper.Map<LeaveRequestDetailsDto>(leaveRequest);
        }

        public async Task<PagedResult<LeaveRequestDetailsDto>> GetMyLeaveRequestsAsync(Guid employeeId, EmployeeQueryParameters parameters)
        {
            var leaveRequestRepository = _unitOfWork.Repository<LeaveRequest>();
            var specification = new MyLeaveRequestsSpecification(employeeId, parameters);
            var leaveRequests = await leaveRequestRepository.ListAsync(specification);
            var totalCount = await leaveRequestRepository.CountAsync(specification);

            var dto = _mapper.Map<List<LeaveRequestDetailsDto>>(leaveRequests);
            return PagedResult<LeaveRequestDetailsDto>.Create(dto, parameters.Page, parameters.PageSize, totalCount);
        }

        public async Task<LeaveRequestDetailsDto> GetMyLeaveRequestByIdAsync( Guid employeeId,Guid requestId)
        {
            var repository = _unitOfWork.Repository<LeaveRequest>();
            var specification =new MyLeaveRequestByIdSpecification(employeeId, requestId);

            var leaveRequest = await repository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(LeaveRequest), requestId);

            return _mapper.Map<LeaveRequestDetailsDto>(leaveRequest);
        }

        public async Task CancelLeaveRequestAsync(Guid employeeId, Guid requestId)
        {
            var repository = _unitOfWork.Repository<LeaveRequest>();
            var specification =new MyLeaveRequestByIdSpecification(employeeId, requestId);

            var leaveRequest =await repository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(LeaveRequest), requestId);

            if (leaveRequest.Status != RequestStatus.Pending)
                throw new BadRequestException("Only pending leave requests can be cancelled.");

            leaveRequest.Status = RequestStatus.Cancelled;

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
