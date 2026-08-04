using AutoMapper;
using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Approval;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.LeaveRequest;
using EmployeeLeaveManagement.Application.Exceptions;
using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Domain.Enums;
using EmployeeLeaveManagement.Infrastructure.Persistence.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public sealed class ApprovalService(IUnitOfWork _unitOfWork, IMapper _mapper) : IApprovalService
    {
        public async Task<PagedResult<PendingLeaveRequestDto>> GetPendingManagerRequestsAsync(EmployeeQueryParameters parameters)
        {
            var leaveRequestsRepository = _unitOfWork.Repository<LeaveRequest>();
            var specification = new PendingManagerLeaveRequestsSpecification(parameters);
            var leaveRequests = await leaveRequestsRepository.ListAsync(specification);
            var totalCount = await leaveRequestsRepository.CountAsync(specification);

            var dto = _mapper.Map<List<PendingLeaveRequestDto>>(leaveRequests);

            return PagedResult<PendingLeaveRequestDto>.Create(dto,parameters.Page,parameters.PageSize,totalCount);
        }

        public async Task<PagedResult<PendingLeaveRequestDto>> GetPendingHRRequestsAsync(EmployeeQueryParameters parameters)
        {
            var leaveRequestRepository = _unitOfWork.Repository<LeaveRequest>();
            var specification = new PendingHRLeaveRequestsSpecification(parameters);
            var leaveRequests = await leaveRequestRepository.ListAsync(specification);
            var totalCount = await leaveRequestRepository.CountAsync(specification);

            var dto = _mapper.Map<List<PendingLeaveRequestDto>>(leaveRequests);

            return PagedResult<PendingLeaveRequestDto>.Create(dto, parameters.Page, parameters.PageSize,totalCount);
        }

        public async Task ManagerApproveAsync(Guid managerId, Guid requestId, ApprovalDecisionDto decision)
        {
            var leaveRequest = await GetLeaveRequestAsync(requestId);
            EnsureStatus(leaveRequest, RequestStatus.Pending);
            
            var approval = await GetOrCreateApprovalAsync(leaveRequest);

            approval.ManagerId = managerId;
            approval.ManagerDecision = Decision.Approved;
            approval.ManagerComment = decision.Comment;
            approval.ManagerDecisionDate = DateTime.UtcNow;


            leaveRequest.Status = RequestStatus.ManagerApproved;
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task ManagerRejectAsync(Guid managerId, Guid requestId, ApprovalDecisionDto decision)
        {
            var leaveRequest = await GetLeaveRequestAsync(requestId);
            EnsureStatus(leaveRequest, RequestStatus.Pending);

            var approval = await GetOrCreateApprovalAsync(leaveRequest);

            approval.ManagerId = managerId;
            approval.ManagerDecision = Decision.Rejected;
            approval.ManagerComment = decision.Comment;
            approval.ManagerDecisionDate = DateTime.UtcNow;

            leaveRequest.Status = RequestStatus.RejectedByManager;

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task HRApproveAsync(Guid hrId, Guid requestId, ApprovalDecisionDto decision)
        {
            var leaveRequest = await GetLeaveRequestAsync(requestId);
            EnsureStatus(leaveRequest, RequestStatus.ManagerApproved);

            var approval = await GetOrCreateApprovalAsync(leaveRequest);

            approval.HRId = hrId;
            approval.HRDecision = Decision.Approved;
            approval.HRComment = decision.Comment;
            approval.HRDecisionDate = DateTime.UtcNow;

            var balanceRepository = _unitOfWork.Repository<EmployeeLeaveBalance>();
            var balanceSpecification = new EmployeeLeaveBalanceSpecification(leaveRequest.EmployeeId, leaveRequest.LeaveTypeId);
            var balance = await balanceRepository.FirstOrDefaultAsync(balanceSpecification)
                        ?? throw new BadRequestException("Employee leave balance was not found.");
            balance.RemainingDays -= leaveRequest.TotalDays;

            leaveRequest.Status = RequestStatus.HRApproved;

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task HRRejectAsync(Guid hrId, Guid requestId, ApprovalDecisionDto decision)
        {
            var leaveRequest = await GetLeaveRequestAsync(requestId);

            EnsureStatus(leaveRequest, RequestStatus.ManagerApproved);

            var approval = await GetOrCreateApprovalAsync(leaveRequest);

            approval.HRId = hrId;
            approval.HRDecision = Decision.Rejected;
            approval.HRComment = decision.Comment;
            approval.HRDecisionDate = DateTime.UtcNow;

            leaveRequest.Status = RequestStatus.RejectedByHR;

            await _unitOfWork.SaveChangesAsync();
        }




        #region Helpers
        private async Task<LeaveRequest> GetLeaveRequestAsync(Guid requestId)
        {
            var leaveRequestRepository = _unitOfWork.Repository<LeaveRequest>();
            var specification = new LeaveRequestForApprovalSpecification(requestId);
            var leaverequest = await leaveRequestRepository.FirstOrDefaultAsync(specification)
                ?? throw new NotFoundException(nameof(LeaveRequest), requestId);

            return leaverequest;
        }

        private async Task<Approval> GetOrCreateApprovalAsync(LeaveRequest leaveRequest)
        {
            if (leaveRequest.Approval is not null)
                return leaveRequest.Approval;

            var approval = new Approval
            {
                LeaveRequestId = leaveRequest.Id
            };

            var approvalRepository = _unitOfWork.Repository<Approval>();
            await approvalRepository.AddAsync(approval);
            leaveRequest.Approval = approval;

            return approval;
        }

        private static void EnsureStatus(LeaveRequest leaveRequest, RequestStatus expectedStatus)
        {
            if (leaveRequest.Status != expectedStatus)
                throw new BadRequestException($"Leave request must be '{expectedStatus}' to perform this action.");
        }
        #endregion
    }
}
