using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.DTOs.Auth;
using EmployeeLeaveManagement.Domain.Common.Exceptions;
using EmployeeLeaveManagement.Domain.Constants;
using EmployeeLeaveManagement.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public class AuthService(
        UserManager<Employee> _userManager,
        SignInManager<Employee> _signInManager,
        ITokenService _tokenService)
        : IAuthService
    {
        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
        {
            var user = new Employee()
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                UserName = dto.Email,
                Email = dto.Email,
                DepartmentId = dto.DepartmentId,
            };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {;
                var errors = result.Errors.Select(e => e.Description).ToList();
                throw new BadRequestException(errors);
            }

            var roleResult = await _userManager.AddToRoleAsync(user, Roles.Employee);
            if (!roleResult.Succeeded)
            {
                var errors = roleResult.Errors.Select(e => e.Description).ToList();
                throw new BadRequestException(errors);
            }

            return new AuthResponseDto()
            {
                Email = user.Email,
                FullName = $"{user.FirstName} {user.LastName}",
                Token = await _tokenService.GenerateTokenAsync(user)
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new InvalidCredentialsException();
            }

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!signInResult.Succeeded)
            {
                throw new InvalidCredentialsException();
            }
            return new AuthResponseDto()
            {
                Email = user.Email!,
                FullName = $"{user.FirstName} {user.LastName}",
                Token = await _tokenService.GenerateTokenAsync(user)
            };
        }
    }
}
