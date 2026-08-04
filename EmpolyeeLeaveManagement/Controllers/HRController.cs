    using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Approval;
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
    [Authorize(Roles = Roles.HR)]
    public class HRController(
        IEmployeeManagementService _employeeService,
        IApprovalService _approvalService)
        : ApiControllerBase
    {

        #region Employee Management Endpoints

        [HttpGet("employees/{id:guid}")]
        public async Task<ActionResult<EmployeeDetailsDto>> GetById(Guid id)
            => Ok(await _employeeService.GetEmployeeByIdAsync(id));


        [HttpGet("employees")]
        public async Task<ActionResult<PagedResult<EmployeeSummaryDto>>> GetAll([FromQuery] EmployeeQueryParameters parameters)
            => Ok(await _employeeService.GetEmployeesAsync(parameters));


        [HttpPut("employees/{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateEmployeeDto dto)
        {
            await _employeeService.UpdateEmployeeAsync(id, dto);
            return NoContent();
        }


        [HttpDelete("employees/{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _employeeService.DeleteEmployeeAsync(id);
            return NoContent();
        }
        #endregion

        #region LeaveRequest Management Endpoints

        [HttpGet("pending")]
        public async Task<ActionResult<PagedResult<PendingLeaveRequestDto>>> GetPendingHRRequestsAsync(EmployeeQueryParameters parameters)
            => Ok(await _approvalService.GetPendingHRRequestsAsync(parameters));

        [HttpPatch("{requestId:guid}/approve")]
        public async Task<ActionResult> HRApproveAsync(Guid requestId, [FromBody] ApprovalDecisionDto decision)
        {
            var hrId = CurrentUserId;
            await _approvalService.HRApproveAsync(hrId, requestId, decision);
            return NoContent();
        }

        [HttpPatch("{requestId:guid}/reject")]
        public async Task<ActionResult> HRRejectAsync(Guid requestId, [FromBody] ApprovalDecisionDto decision)
        {
            var hrId = CurrentUserId;
            await _approvalService.HRRejectAsync(hrId, requestId, decision);
            return NoContent();
        }
        #endregion
    }
}
