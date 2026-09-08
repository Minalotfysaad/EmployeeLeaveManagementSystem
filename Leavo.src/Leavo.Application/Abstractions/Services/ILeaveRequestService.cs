using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.LeaveRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Abstractions.Services
{
    public interface ILeaveRequestService
    {
        Task<LeaveRequestDetailsDto> CreateLeaveRequestAsync(Guid id, CreateLeaveRequestDto dto);

        Task<PagedResult<LeaveRequestDetailsDto>>GetMyLeaveRequestsAsync(Guid employeeId,EmployeeQueryParameters parameters);

        Task<LeaveRequestDetailsDto> GetMyLeaveRequestByIdAsync(Guid employeeId, Guid requestId);

        Task CancelLeaveRequestAsync(Guid employeeId, Guid requestId);
    }
}
