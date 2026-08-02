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
    public class EmployeeController(IEmployeeService _employeeService) : ControllerBase
    {

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<EmployeeDetailsDto>> GetById(Guid id)
            => Ok(await _employeeService.GetEmployeeByIdAsync(id));


        [HttpGet]
        [Authorize(Roles = $"{Roles.HR},{Roles.Manager}")]
        public async Task<ActionResult<PagedResult<EmployeeSummaryDto>>> GetAll([FromQuery] EmployeeQueryParameters parameters)
            => Ok(await _employeeService.GetEmployeesAsync(parameters));


        [HttpPut("{id:guid}")]
        [Authorize(Roles = Roles.HR)]
        public async Task<IActionResult> Update(Guid id, UpdateEmployeeDto dto)
        {
            await _employeeService.UpdateEmployeeAsync(id, dto);
            return NoContent();
        }


        [HttpDelete("{id:guid}")]
        [Authorize(Roles = Roles.HR)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _employeeService.DeleteEmployeeAsync(id);
            return NoContent();
        }

    }
}
