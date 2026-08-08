    using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Balance;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Domain.Constants;
using EmployeeLeaveManagement.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeLeaveManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController(
        IEmployeeManagementService _employeeService,
        IBalanceService _balanceService)
        : ApiControllerBase
    {
        [Authorize(Roles = Roles.Employee)]
        [HttpGet("me")]
        public async Task<ActionResult<EmployeeDetailsDto>> GetMyProfile()
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(CurrentUserId);

            return Ok(employee);
        }


        [HttpGet("me/balances")]
        public async Task<ActionResult<List<BalanceDto>>> GetMyBalances()
        {
            var balances = await _balanceService.GetBalancesAsync(CurrentUserId);

            return Ok(balances);
        }


        [HttpGet("me/balances/{leaveTypeId:guid}")]
        public async Task<ActionResult<BalanceDto>> GetMyBalance(Guid leaveTypeId)
        {
            var balance = await _balanceService.GetBalanceAsync(CurrentUserId, leaveTypeId);

            return Ok(balance);
        }
    }
}
