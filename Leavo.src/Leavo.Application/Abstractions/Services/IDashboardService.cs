using Leavo.Application.DTOs.Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Abstractions.Services
{
    public interface IDashboardService
    {
        Task<EmployeeDashboardDto> GetEmployeeDashboardAsync(Guid employeeId);
        Task<ManagerDashboardDto> GetManagerDashboardAsync(Guid managerId);
        Task<HRDashboardDto> GetHRDashboardAsync();
    }
}
