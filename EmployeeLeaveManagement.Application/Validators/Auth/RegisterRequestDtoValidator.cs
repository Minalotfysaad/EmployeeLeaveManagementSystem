using EmployeeLeaveManagement.Application.DTOs.Auth;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Validators.Auth
{
    public sealed class RegisterRequestDtoValidator : AbstractValidator<RegisterRequestDto>
    {
        public RegisterRequestDtoValidator()
        {
            RuleFor(dto => dto.Email).NotEmpty()
                .EmailAddress()
                .MaximumLength(100);

            RuleFor(dto => dto.Password).NotEmpty()
                .MinimumLength(8).WithMessage("Password must be at least 8 characters")
                .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                .Matches("[0-9]").WithMessage("Password must contain at least one number.")
                .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");

            RuleFor(dto => dto.FirstName)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(dto => dto.LastName)
                .NotEmpty()
                .MaximumLength(50);
        }
    }
}
