using EmployeeLeaveManagement.Application.DTOs.Balance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Abstractions.Services
{
    public interface IBalanceService
    {
        Task<List<BalanceDto>> GetBalancesAsync( Guid employeeId);
        Task<BalanceDto> GetBalanceAsync( Guid employeeId, Guid leaveTypeId);
        Task UpdateBalanceAsync(Guid employeeId, Guid leaveTypeId, UpdateBalanceDto dto);
    }
}
