using EmployeeLeaveManagement.Application.DTOs.Holiday;
using EmployeeLeaveManagement.Domain.Entities;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Validators.Holiday
{
    public sealed class CreateHolidayDtoValidator : AbstractValidator<CreateHolidayDto>
    {
        public CreateHolidayDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.StartDate)
                .NotEmpty();

            RuleFor(x => x.EndDate)
                .NotEmpty()
                .GreaterThanOrEqualTo(x => x.StartDate)
                .WithMessage("End date must be after or equal to the start date.");

        }
    }
}
