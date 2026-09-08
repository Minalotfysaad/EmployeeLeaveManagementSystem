using EmployeeLeaveManagement.Application.DTOs.Balance;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Validators.Balance
{
    public sealed class UpdateBalanceDtoValidator
        : AbstractValidator<UpdateBalanceDto>
    {
        public UpdateBalanceDtoValidator()
        {
            RuleFor(x => x.RemainingDays)
                .GreaterThanOrEqualTo(0);
        }
    }
}

