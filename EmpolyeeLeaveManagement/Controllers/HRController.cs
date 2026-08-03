    using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Domain.Constants;
using EmployeeLeaveManagement.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeLeaveManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HRController(IEmployeeManagementService _employeeService) : ApiControllerBase
    {

        [HttpGet("employees/{id:guid}")]
        [Authorize(Roles = Roles.HR)]
        public async Task<ActionResult<EmployeeDetailsDto>> GetById(Guid id)
            => Ok(await _employeeService.GetEmployeeByIdAsync(id));


        [HttpGet("employees")]
        [Authorize(Roles = $"{Roles.HR},{Roles.Manager}")]
        public async Task<ActionResult<PagedResult<EmployeeSummaryDto>>> GetAll([FromQuery] EmployeeQueryParameters parameters)
            => Ok(await _employeeService.GetEmployeesAsync(parameters));


        [HttpPut("employees/{id:guid}")]
        [Authorize(Roles = Roles.HR)]
        public async Task<IActionResult> Update(Guid id, UpdateEmployeeDto dto)
        {
            await _employeeService.UpdateEmployeeAsync(id, dto);
            return NoContent();
        }


        [HttpDelete("employees/{id:guid}")]
        [Authorize(Roles = Roles.HR)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _employeeService.DeleteEmployeeAsync(id);
            return NoContent();
        }

    }
}
