using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Approval;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.LeaveRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Abstractions.Services
{
    public interface IApprovalService
    {
        Task<PagedResult<PendingLeaveRequestDto>> GetPendingManagerRequestsAsync(EmployeeQueryParameters parameters);

        Task ManagerApproveAsync(Guid managerId, Guid requestId, ApprovalDecisionDto decision);

        Task ManagerRejectAsync(Guid managerId, Guid requestId, ApprovalDecisionDto decision);

        Task<PagedResult<PendingLeaveRequestDto>> GetPendingHRRequestsAsync(EmployeeQueryParameters parameters);

        Task HRApproveAsync(Guid hrId, Guid requestId, ApprovalDecisionDto decision);

        Task HRRejectAsync(Guid hrId, Guid requestId, ApprovalDecisionDto decision);
    }
}
