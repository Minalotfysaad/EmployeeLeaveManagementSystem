using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Department;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Abstractions.Services
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
