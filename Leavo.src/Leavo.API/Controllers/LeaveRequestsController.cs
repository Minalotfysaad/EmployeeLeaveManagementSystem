using Leavo.Application.Abstractions.Services;
using Leavo.Application.Common.Models;
using Leavo.Application.DTOs.Employee;
using Leavo.Application.DTOs.LeaveRequest;
using Leavo.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Leavo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Employee")]
    public class LeaveRequestsController(
        ILeaveRequestService _leaveRequestService)
        : ApiControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<LeaveRequestDetailsDto>> CreateLeaveRequest([FromBody] CreateLeaveRequestDto dto)
        {
            var employeeId = CurrentUserId;

            var leaveRequest =await _leaveRequestService.CreateLeaveRequestAsync(employeeId, dto);

            return CreatedAtAction(nameof(GetMyLeaveRequestById),new { id = leaveRequest.Id },leaveRequest);
        }

        [HttpGet("my")]
        public async Task<ActionResult<PagedResult<LeaveRequestDetailsDto>>> GetMyLeaveRequests([FromQuery] EmployeeQueryParameters parameters)
        {
            var employeeId = CurrentUserId;
            var requests = await _leaveRequestService.GetMyLeaveRequestsAsync(employeeId, parameters);

            return Ok(requests);
        }

        [HttpGet("my/{id:guid}")]
        public async Task<ActionResult<LeaveRequestDetailsDto>> GetMyLeaveRequestById(Guid id)
        {
            var employeeId = CurrentUserId;
            var request =await _leaveRequestService.GetMyLeaveRequestByIdAsync(employeeId, id);

            return Ok(request);
        }

        [HttpPatch("my/{id:guid}/cancel")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var employeeId = CurrentUserId; ;
            await _leaveRequestService.CancelLeaveRequestAsync(employeeId, id);

            return NoContent();
        }
    }
}