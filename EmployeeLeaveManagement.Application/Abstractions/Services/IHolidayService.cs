using EmployeeLeaveManagement.Application.Common.Models;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.DTOs.Holiday;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Abstractions.Services
{
    public interface IHolidayService
    {
        Task<PagedResult<HolidaySummaryDto>> GetAllAsync(EmployeeQueryParameters parameters);
        Task<HolidayDetailsDto> GetByIdAsync(Guid id);
        Task<HolidayDetailsDto> CreateAsync(Guid hrId, CreateHolidayDto dto);
        Task UpdateAsync(Guid id, UpdateHolidayDto dto);
        Task DeleteAsync(Guid id);
    }
}
