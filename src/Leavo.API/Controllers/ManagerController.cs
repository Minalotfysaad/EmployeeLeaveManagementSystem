using Leavo.Application.Abstractions.Services;
using Leavo.Application.Common.Models;
using Leavo.Application.DTOs.Approval;
using Leavo.Application.DTOs.Dashboard;
using Leavo.Application.DTOs.Employee;
using Leavo.Application.DTOs.LeaveRequest;
using Leavo.Domain.Constants;
using Leavo.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Leavo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = Roles.Manager)]
    public class ManagerController(
        IApprovalService _approvalService,
        IDashboardService _dashboardService)
        : ApiControllerBase
    {
        #region LeaveRequests Management Endpoints

        [HttpGet("pending")]
        public async Task<ActionResult<PagedResult<PendingLeaveRequestDto>>> GetPendingManagerRequestsAsync([FromQuery] EmployeeQueryParameters parameters)
            => Ok(await _approvalService.GetPendingManagerRequestsAsync(parameters));

        [HttpPatch("{requestId:guid}/approve")]
        public async Task<ActionResult> ManagerApproveAsync( Guid requestId, [FromBody] ApprovalDecisionDto decision)
        {
            var managerId = CurrentUserId;
            await _approvalService.ManagerApproveAsync(managerId, requestId, decision);
            return NoContent();
        }

        [HttpPatch("{requestId:guid}/reject")]
        public async Task<ActionResult> ManagerRejectAsync(Guid requestId, [FromBody] ApprovalDecisionDto decision)
        {
            var managerId = CurrentUserId;
            await _approvalService.ManagerRejectAsync(managerId, requestId, decision);
            return NoContent();
        }
        #endregion

        #region Dashboard

        [HttpGet("dashboard")]
        public async Task<ActionResult<ManagerDashboardDto>>GetDashboardAsync()
        {
            var managerId = CurrentUserId;
            var dashboard = await _dashboardService.GetManagerDashboardAsync(managerId);

            return Ok(dashboard);
        }

        #endregion
    }
}
