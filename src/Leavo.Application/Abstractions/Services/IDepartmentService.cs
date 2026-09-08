using Leavo.Application.Common.Models;
using Leavo.Application.DTOs.Department;
using Leavo.Application.DTOs.Employee;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Abstractions.Services
{
    public interface IDepartmentService
    {
        Task<PagedResult<DepartmentDetailsDto>> GetAllAsync(EmployeeQueryParameters parameters);
        Task<DepartmentDetailsDto> GetByIdAsync(Guid id);
        Task<DepartmentDetailsDto> CreateAsync(CreateDepartmentDto dto);
        Task UpdateAsync(Guid id, UpdateDepartmentDto dto);
        Task DeleteAsync(Guid id);
    }
}
