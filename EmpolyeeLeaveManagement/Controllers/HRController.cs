    using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Approval;
using EmployeeLeaveManagement.Application.DTOs.Balance;
using EmployeeLeaveManagement.Application.DTOs.Dashboard;
using EmployeeLeaveManagement.Application.DTOs.Department;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.LeaveRequest;
using EmployeeLeaveManagement.Application.DTOs.RoleManagement;
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
        IBalanceService _balanceService,
        IApprovalService _approvalService,
        IDepartmentService _departmentService,
        IDashboardService _dashboardService,
        IOrganizationManagementService _organizationService)
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

        #region Employee Leave Balance Management

        [HttpGet("employees/{employeeId:guid}/balances")]
        public async Task<ActionResult<List<BalanceDto>>> GetEmployeeBalances(Guid employeeId)
        {
            var balances =await _balanceService.GetBalancesAsync(employeeId);

            return Ok(balances);
        }

        [HttpGet("employees/{employeeId:guid}/balances/{leaveTypeId:guid}")]
        public async Task<ActionResult<BalanceDto>> GetEmployeeBalance(Guid employeeId, Guid leaveTypeId)
        {
            var balance = await _balanceService.GetBalanceAsync(employeeId, leaveTypeId);

            return Ok(balance);
        }

        [HttpPatch("employees/{employeeId:guid}/balances/{leaveTypeId:guid}")]
        public async Task<IActionResult> UpdateEmployeeBalance(Guid employeeId, Guid leaveTypeId, [FromBody] UpdateBalanceDto dto)
        {
            await _balanceService.UpdateBalanceAsync( employeeId, leaveTypeId, dto);

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

        #region Department Management

        [HttpGet("departments")]
        public async Task<ActionResult<PagedResult<DepartmentDetailsDto>>>GetDepartments([FromQuery] EmployeeQueryParameters parameters)
            => Ok(await _departmentService.GetAllAsync(parameters));


        [HttpGet("departments/{id:guid}")]
        public async Task<ActionResult<DepartmentDetailsDto>>GetDepartment(Guid id)
            =>  Ok(await _departmentService.GetByIdAsync(id));


        [HttpPost("departments")]
        public async Task<ActionResult<DepartmentDetailsDto>>CreateDepartment([FromBody] CreateDepartmentDto dto)
        {
            var department = await _departmentService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetDepartment),
                new { id = department.Id },
                department);
        }

        [HttpPut("departments/{id:guid}")]
        public async Task<IActionResult> UpdateDepartment(Guid id, [FromBody] UpdateDepartmentDto dto)
        {
            await _departmentService.UpdateAsync(id, dto);

            return NoContent();
        }

        [HttpDelete("departments/{id:guid}")]
        public async Task<IActionResult> DeleteDepartment(Guid id)
        {
            await _departmentService.DeleteAsync(id);

            return NoContent();
        }

        #endregion

        #region Dashboard

        [HttpGet("dashboard")]
        public async Task<ActionResult<HRDashboardDto>>GetDashboardAsync()
        {
            var dashboard = await _dashboardService.GetHRDashboardAsync();

            return Ok(dashboard);
        }

        #endregion

        #region Organization Management
        [HttpPatch("employees/{employeeId:guid}/role")]
        public async Task<ActionResult> UpdateEmployeeRoleAsync(Guid employeeId, [FromBody] UpdateEmployeeRoleDto dto)
        {
            await _organizationService.UpdateEmployeeRoleAsync(employeeId, dto);

            return NoContent();
        }

        [HttpPatch("employees/{employeeId:guid}/manager/{managerId:guid}")]
        public async Task<ActionResult> AssignManagerAsync(Guid employeeId,Guid managerId)
        {
            await _organizationService.AssignManagerAsync(employeeId, managerId);

            return NoContent();
        }

        [HttpPatch("employees/{employeeId:guid}/department/{departmentId:guid}")]
        public async Task<ActionResult> AssignDepartmentAsync(Guid employeeId, Guid departmentId)
        {
            await _organizationService.AssignDepartmentAsync(employeeId, departmentId);

            return NoContent();
        }
        #endregion
    }
}
