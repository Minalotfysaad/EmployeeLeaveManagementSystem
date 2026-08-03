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
    public class EmployeeController(IEmployeeManagementService _employeeService) : ApiControllerBase
    {
        [Authorize(Roles = Roles.Employee)]
        [HttpGet("me")]
        public async Task<ActionResult<EmployeeDetailsDto>> GetMyProfile()
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(CurrentUserId);

            return Ok(employee);
        }
    }
}
