using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.DTOs.Auth;
using EmployeeLeaveManagement.Domain.Common.Exceptions;
using EmployeeLeaveManagement.Domain.Constants;
using EmployeeLeaveManagement.Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public class AuthService(
        UserManager<Employee> _userManager,
        SignInManager<Employee> _signInManager,
        ITokenService _tokenService,
        IValidator<RegisterRequestDto> registerValidator,
        IValidator<LoginRequestDto> _loginValidator)
        : IAuthService
    {
        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
        {
            //Validate
            var validationResult = await registerValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new BadRequestException(
                    validationResult.Errors.Select(e => e.ErrorMessage).ToList());
            }

            //Map
            var user = new Employee()
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                UserName = dto.Email,
                Email = dto.Email,
                DepartmentId = dto.DepartmentId,
            };

            //Create
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {;
                var errors = result.Errors.Select(e => e.Description).ToList();
                throw new BadRequestException(errors);
            }

            //Add Role
            var roleResult = await _userManager.AddToRoleAsync(user, Roles.Employee);
            if (!roleResult.Succeeded)
            {
                var errors = roleResult.Errors.Select(e => e.Description).ToList();
                throw new BadRequestException(errors);
            }

            //Return
            return new AuthResponseDto()
            {
                Email = user.Email,
                FullName = $"{user.FirstName} {user.LastName}",
                Token = await _tokenService.GenerateTokenAsync(user)
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
        {
            //Validate
            var validationResult = await _loginValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new BadRequestException(validationResult.Errors.Select(e => e.ErrorMessage).ToList());
            }

            //Check Email
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new InvalidCredentialsException();
            }

            //Check Password
            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!signInResult.Succeeded)
            {
                throw new InvalidCredentialsException();
            }

            //Return
            return new AuthResponseDto()
            {
                Email = user.Email!,
                FullName = $"{user.FirstName} {user.LastName}",
                Token = await _tokenService.GenerateTokenAsync(user)
            };
        }
    }
}
