using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Approval;
using EmployeeLeaveManagement.Application.DTOs.Dashboard;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.LeaveRequest;
using EmployeeLeaveManagement.Domain.Constants;
using EmployeeLeaveManagement.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeLeaveManagement.API.Controllers
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
        public async Task<ActionResult<PagedResult<PendingLeaveRequestDto>>> GetPendingManagerRequestsAsync(EmployeeQueryParameters parameters)
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
