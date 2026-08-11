using EmployeeLeaveManagement.Application.Abstractions.Caching;
using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models.Caching;
using EmployeeLeaveManagement.Application.DTOs.Auth;
using EmployeeLeaveManagement.Application.Exceptions;
using EmployeeLeaveManagement.Domain.Constants;
using EmployeeLeaveManagement.Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public class AuthService(
        UserManager<Employee> _userManager,
        SignInManager<Employee> _signInManager,
        IUnitOfWork _unitOfWork,
        ICacheService _cacheService,
        ITokenService _tokenService,
        ILogger<AuthService> _logger,
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

            //Create Balance
            var leaveTypeRepository = _unitOfWork.Repository<LeaveType>();
            var leaveTypes = await leaveTypeRepository.ListAllAsync();

            var balanceRepository = _unitOfWork.Repository<EmployeeLeaveBalance>();

            foreach (var leaveType in leaveTypes)
            {
                await balanceRepository.AddAsync(new EmployeeLeaveBalance
                {
                    EmployeeId = user.Id,
                    LeaveTypeId = leaveType.Id,
                    RemainingDays = leaveType.DefaultDays
                });
            }

            await _unitOfWork.SaveChangesAsync();
            await _cacheService.RemoveAsync(CacheKeys.HRDashboard);


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
                _logger.LogWarning("Failed login attempt for email {Email}", dto.Email);

                throw new InvalidCredentialsException();
            }

            _logger.LogInformation("Employee logged in successfully. EmployeeId: {EmployeeId}",user.Id);

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
