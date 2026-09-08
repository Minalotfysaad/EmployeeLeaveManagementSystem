using EmployeeLeaveManagement.Application.DTOs.LeaveType;
using EmployeeLeaveManagement.Domain.Entities;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Validators.LeaveType
{
    public sealed class CreateLeaveTypeDtoValidator : AbstractValidator<CreateLeaveTypeDto>
    {
        public CreateLeaveTypeDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Description)
                .MaximumLength(500);

            RuleFor(x => x.DefaultDays)
                .NotEmpty()
                .GreaterThan(0)
                .LessThanOrEqualTo(365);
        }
    }
}
