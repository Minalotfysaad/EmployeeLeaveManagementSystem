using Leavo.Application.Abstractions.Services;
using Leavo.Application.Common.Models;
using Leavo.Application.DTOs.Employee;
using Leavo.Application.DTOs.Holiday;
using Leavo.Domain.Constants;
using Leavo.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Leavo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = Roles.HR)]
    public class HolidaysController(
        IHolidayService _holidayService)
        : ApiControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<PagedResult<HolidaySummaryDto>>> GetAll([FromQuery] EmployeeQueryParameters parameters)
            => Ok(await _holidayService.GetAllAsync(parameters));

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<HolidayDetailsDto>> Get(Guid id)
            => Ok(await _holidayService.GetByIdAsync(id));

        [HttpPost]
        public async Task<ActionResult<HolidayDetailsDto>> Create(CreateHolidayDto dto)
        {
            var result = await _holidayService.CreateAsync(CurrentUserId, dto);

            return CreatedAtAction(
                nameof(Get),
                new { id = result.Id },
                result);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id,UpdateHolidayDto dto)
        {
            await _holidayService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _holidayService.DeleteAsync(id);
            return NoContent();
        }

    }
}
