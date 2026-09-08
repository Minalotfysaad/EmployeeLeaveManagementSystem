using Leavo.Application.Common.Models;
using Leavo.Application.DTOs.Employee;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Abstractions.Services
{
    public interface IEmployeeManagementService
    {
        Task<EmployeeDetailsDto> GetEmployeeByIdAsync(Guid id);

        Task<PagedResult<EmployeeSummaryDto>> GetEmployeesAsync(EmployeeQueryParameters parameters);

        Task UpdateEmployeeAsync(Guid id, UpdateEmployeeDto dto);

        Task DeleteEmployeeAsync(Guid id);
    }
}
