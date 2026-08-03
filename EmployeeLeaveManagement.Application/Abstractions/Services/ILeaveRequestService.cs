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
    }
}
