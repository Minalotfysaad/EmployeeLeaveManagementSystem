using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.LeaveType;
using EmployeeLeaveManagement.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeLeaveManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = Roles.HR)]
    public class LeaveTypesController(
        ILeaveTypeService _leaveTypeService)
        : ApiControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<PagedResult<LeaveTypeSummaryDto>>> GetAll([FromQuery] EmployeeQueryParameters parameters)
            => Ok(await _leaveTypeService.GetAllAsync(parameters));

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<LeaveTypeDetailsDto>> GetById(Guid id)
            => Ok(await _leaveTypeService.GetByIdAsync(id));


        [HttpPost]
        public async Task<ActionResult<LeaveTypeDetailsDto>> Create([FromBody] CreateLeaveTypeDto dto)
        {
            var result =await _leaveTypeService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Id },
                result);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLeaveTypeDto dto)
        {
            await _leaveTypeService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _leaveTypeService.DeleteAsync(id);
            return NoContent();
        }
    }
}
