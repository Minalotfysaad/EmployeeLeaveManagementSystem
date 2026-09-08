using Leavo.Application.Common.Models;
using Leavo.Application.DTOs.Employee;
using Leavo.Application.DTOs.Holiday;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Abstractions.Services
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
