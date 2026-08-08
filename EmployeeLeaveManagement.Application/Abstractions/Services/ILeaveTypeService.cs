using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.LeaveType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Abstractions.Services
{
    public interface ILeaveTypeService
    {
        Task<PagedResult<LeaveTypeSummaryDto>> GetAllAsync(EmployeeQueryParameters parameters);
        Task<LeaveTypeDetailsDto> GetByIdAsync(Guid id);
        Task<LeaveTypeDetailsDto> CreateAsync(CreateLeaveTypeDto dto);
        Task UpdateAsync(Guid id, UpdateLeaveTypeDto dto);
        Task DeleteAsync(Guid id);
    }
}
