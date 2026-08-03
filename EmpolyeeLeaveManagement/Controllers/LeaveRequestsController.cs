using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.DTOs.LeaveRequest;
using EmployeeLeaveManagement.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeLeaveManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Employee")]
    public class LeaveRequestsController(
    ILeaveRequestService leaveRequestService)
    : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<LeaveRequestDetailsDto>> CreateLeaveRequest([FromBody] CreateLeaveRequestDto dto)
        {
            var employeeIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(employeeIdClaim, out var employeeId))
                throw new UnauthorizedAccessException("Invalid user identity.");

            var leaveRequest = await leaveRequestService.CreateLeaveRequestAsync(employeeId, dto);

            return Ok(leaveRequest);
        }
    }
}