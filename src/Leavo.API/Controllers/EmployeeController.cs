    using Leavo.Application.Abstractions.Services;
using Leavo.Application.Common.Models;
using Leavo.Application.DTOs.Balance;
using Leavo.Application.DTOs.Dashboard;
using Leavo.Application.DTOs.Employee;
using Leavo.Domain.Constants;
using Leavo.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Leavo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController(
        IEmployeeManagementService _employeeService,
        IBalanceService _balanceService,
        IDashboardService _dashboardService)
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

        [HttpGet("dashboard")]
        public async Task<ActionResult<EmployeeDashboardDto>>GetDashboardAsync()
        {
            var employeeId = CurrentUserId;

            var dashboard =await _dashboardService.GetEmployeeDashboardAsync(employeeId);

            return Ok(dashboard);
        }
    }
}
