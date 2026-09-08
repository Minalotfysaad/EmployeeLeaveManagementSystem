using Leavo.Application.Common.Models;
using Leavo.Application.DTOs.Approval;
using Leavo.Application.DTOs.Employee;
using Leavo.Application.DTOs.LeaveRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Abstractions.Services
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
