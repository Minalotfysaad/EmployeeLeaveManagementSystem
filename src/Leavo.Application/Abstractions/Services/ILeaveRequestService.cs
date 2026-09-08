using Leavo.Application.Common.Models;
using Leavo.Application.DTOs.Employee;
using Leavo.Application.DTOs.LeaveRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Abstractions.Services
{
    public interface ILeaveRequestService
    {
        Task<LeaveRequestDetailsDto> CreateLeaveRequestAsync(Guid id, CreateLeaveRequestDto dto);

        Task<PagedResult<LeaveRequestDetailsDto>>GetMyLeaveRequestsAsync(Guid employeeId,EmployeeQueryParameters parameters);

        Task<LeaveRequestDetailsDto> GetMyLeaveRequestByIdAsync(Guid employeeId, Guid requestId);

        Task CancelLeaveRequestAsync(Guid employeeId, Guid requestId);
    }
}
