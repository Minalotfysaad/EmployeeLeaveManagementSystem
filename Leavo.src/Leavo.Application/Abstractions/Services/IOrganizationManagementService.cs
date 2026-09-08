using EmployeeLeaveManagement.Application.DTOs.RoleManagement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Abstractions.Services
{
    public interface IOrganizationManagementService
    {
        Task UpdateEmployeeRoleAsync(Guid employeeId, UpdateEmployeeRoleDto dto);
        Task AssignManagerAsync(Guid employeeId, Guid managerId);
        Task AssignDepartmentAsync( Guid employeeId, Guid departmentId);
    }
}
