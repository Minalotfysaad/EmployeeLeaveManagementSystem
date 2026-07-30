using EmployeeLeaveManagement.Application.DTOs.Auth;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Validators.Auth
{
    public sealed class LoginRequestDtoValidator : AbstractValidator<LoginRequestDto>
    {
        public LoginRequestDtoValidator()
        {
            RuleFor(dto => dto.Email)
                .NotEmpty()
                .EmailAddress()
                .MaximumLength(100);

            RuleFor(dto => dto.Password)
                .NotEmpty();
        }
    }
}
