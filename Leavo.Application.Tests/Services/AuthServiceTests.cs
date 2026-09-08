using Castle.Core.Logging;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Leavo.Application.Abstractions.Caching;
using Leavo.Application.Abstractions.Persistence;
using Leavo.Application.Abstractions.Services;
using Leavo.Application.Common.Models.Caching;
using Leavo.Application.DTOs.Auth;
using Leavo.Application.Exceptions;
using Leavo.Domain.Constants;
using Leavo.Domain.Entities;
using Leavo.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<UserManager<Employee>> _userManagerMock;
        private readonly Mock<SignInManager<Employee>> _signInManagerMock;

        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<ICacheService> _cacheServiceMock;
        private readonly Mock<ITokenService> _tokenServiceMock;
        private readonly Mock<ILogger<AuthService>> _loggerMock;
        private readonly Mock<IValidator<RegisterRequestDto>> _registerValidatorMock;
        private readonly Mock<IValidator<LoginRequestDto>> _loginValidatorMock;

        private readonly Mock<IGenericRepository<LeaveType>> _leaveTypeRepositoryMock;
        private readonly Mock<IGenericRepository<EmployeeLeaveBalance>> _balanceRepositoryMock;

        private readonly AuthService _service;

        public AuthServiceTests()
        {
            // UserManager dependencies
            var userStoreMock = new Mock<IUserStore<Employee>>();

            _userManagerMock = new Mock<UserManager<Employee>>(
                userStoreMock.Object,
                null!,
                null!,
                null!,
                null!,
                null!,
                null!,
                null!,
                null!);

            // SignInManager dependencies
            var contextAccessorMock = new Mock<IHttpContextAccessor>();
            var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<Employee>>();
            var optionsMock = new Mock<IOptions<IdentityOptions>>();
            var identityOptions = new IdentityOptions();
            optionsMock.Setup(x => x.Value).Returns(identityOptions);

            var schemesMock = new Mock<IAuthenticationSchemeProvider>();
            var userConfirmationMock = new Mock<IUserConfirmation<Employee>>();

            _signInManagerMock = new Mock<SignInManager<Employee>>(
                _userManagerMock.Object,
                contextAccessorMock.Object,
                claimsFactoryMock.Object,
                optionsMock.Object,
                new Mock<ILogger<SignInManager<Employee>>>().Object,
                schemesMock.Object,
                userConfirmationMock.Object);

            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _cacheServiceMock = new Mock<ICacheService>();
            _tokenServiceMock = new Mock<ITokenService>();

            _loggerMock = new Mock<ILogger<AuthService>>();

            _registerValidatorMock =
                new Mock<IValidator<RegisterRequestDto>>();

            _loginValidatorMock =
                new Mock<IValidator<LoginRequestDto>>();

            _leaveTypeRepositoryMock =
                new Mock<IGenericRepository<LeaveType>>();

            _balanceRepositoryMock =
                new Mock<IGenericRepository<EmployeeLeaveBalance>>();

            _unitOfWorkMock
                .Setup(u => u.Repository<LeaveType>())
                .Returns(_leaveTypeRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(u => u.Repository<EmployeeLeaveBalance>())
                .Returns(_balanceRepositoryMock.Object);

            _service = new AuthService(
                _userManagerMock.Object,
                _signInManagerMock.Object,
                _unitOfWorkMock.Object,
                _cacheServiceMock.Object,
                _tokenServiceMock.Object,
                _loggerMock.Object,
                _registerValidatorMock.Object,
                _loginValidatorMock.Object);
        }

        #region RegisterAsync

        [Fact]
        public async Task RegisterAsync_WhenValidationFails_ShouldThrowBadRequestException()
        {
            // Arrange
            var dto = new RegisterRequestDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                Password = "Password123!",
                DepartmentId = Guid.NewGuid()
            };

            var validationResult = new ValidationResult(
            [
                new ValidationFailure(
                nameof(RegisterRequestDto.Email),
                "Invalid email.")
            ]);

            _registerValidatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(validationResult);

            // Act
            var act = () => _service.RegisterAsync(dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _userManagerMock.Verify(
                u => u.CreateAsync(
                    It.IsAny<Employee>(),
                    It.IsAny<string>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task RegisterAsync_WhenUserCreationFails_ShouldThrowBadRequestException()
        {
            // Arrange
            var dto = new RegisterRequestDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                Password = "Password123!",
                DepartmentId = Guid.NewGuid()
            };

            _registerValidatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            var identityResult = IdentityResult.Failed(
                new IdentityError
                {
                    Description = "Email is already registered."
                });

            _userManagerMock
                .Setup(u => u.CreateAsync(
                    It.IsAny<Employee>(),
                    dto.Password))
                .ReturnsAsync(identityResult);

            // Act
            var act = () => _service.RegisterAsync(dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _userManagerMock.Verify(
                u => u.CreateAsync(
                    It.IsAny<Employee>(),
                    dto.Password),
                Times.Once);

            _userManagerMock.Verify(
                u => u.AddToRoleAsync(
                    It.IsAny<Employee>(),
                    It.IsAny<string>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task RegisterAsync_WhenRoleAssignmentFails_ShouldThrowBadRequestException()
        {
            // Arrange
            var dto = new RegisterRequestDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                Password = "Password123!",
                DepartmentId = Guid.NewGuid()
            };

            _registerValidatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _userManagerMock
                .Setup(u => u.CreateAsync(
                    It.IsAny<Employee>(),
                    dto.Password))
                .ReturnsAsync(IdentityResult.Success);

            _userManagerMock
                .Setup(u => u.AddToRoleAsync(
                    It.IsAny<Employee>(),
                    Roles.Employee))
                .ReturnsAsync(
                    IdentityResult.Failed(
                        new IdentityError
                        {
                            Description = "Unable to assign role."
                        }));

            // Act
            var act = () => _service.RegisterAsync(dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _userManagerMock.Verify(
                u => u.CreateAsync(
                    It.IsAny<Employee>(),
                    dto.Password),
                Times.Once);

            _userManagerMock.Verify(
                u => u.AddToRoleAsync(
                    It.IsAny<Employee>(),
                    Roles.Employee),
                Times.Once);

            _leaveTypeRepositoryMock.Verify(
                r => r.ListAllAsync(),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task RegisterAsync_WhenSuccessful_ShouldCreateUserAndReturnAuthResponse()
        {
            // Arrange
            var departmentId = Guid.NewGuid();

            var dto = new RegisterRequestDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                Password = "Password123!",
                DepartmentId = departmentId
            };

            var leaveType1 = new LeaveType
            {
                Id = Guid.NewGuid(),
                Name = "Annual",
                DefaultDays = 21
            };

            var leaveType2 = new LeaveType
            {
                Id = Guid.NewGuid(),
                Name = "Sick",
                DefaultDays = 14
            };

            var leaveTypes = new List<LeaveType>
        {
            leaveType1,
            leaveType2
        };

            const string expectedToken = "generated-token";

            _registerValidatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _userManagerMock
                .Setup(u => u.CreateAsync(
                    It.IsAny<Employee>(),
                    dto.Password))
                .ReturnsAsync(IdentityResult.Success);

            _userManagerMock
                .Setup(u => u.AddToRoleAsync(
                    It.IsAny<Employee>(),
                    Roles.Employee))
                .ReturnsAsync(IdentityResult.Success);

            _leaveTypeRepositoryMock
                .Setup(r => r.ListAllAsync())
                .ReturnsAsync(leaveTypes);

            _balanceRepositoryMock
                .Setup(r => r.AddAsync(
                    It.IsAny<EmployeeLeaveBalance>()))
                .Returns(Task.CompletedTask);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            _cacheServiceMock
                .Setup(c => c.RemoveAsync(CacheKeys.HRDashboard))
                .Returns(Task.CompletedTask);

            _tokenServiceMock
                .Setup(t => t.GenerateTokenAsync(It.IsAny<Employee>()))
                .ReturnsAsync(expectedToken);

            // Act
            var result = await _service.RegisterAsync(dto);

            // Assert
            result.Should().NotBeNull();
            result.Email.Should().Be(dto.Email);
            result.FullName.Should().Be("John Doe");
            result.Token.Should().Be(expectedToken);

            _userManagerMock.Verify(
                u => u.CreateAsync(
                    It.Is<Employee>(e =>
                        e.FirstName == dto.FirstName &&
                        e.LastName == dto.LastName &&
                        e.Email == dto.Email &&
                        e.UserName == dto.Email &&
                        e.DepartmentId == dto.DepartmentId),
                    dto.Password),
                Times.Once);

            _userManagerMock.Verify(
                u => u.AddToRoleAsync(
                    It.IsAny<Employee>(),
                    Roles.Employee),
                Times.Once);

            _leaveTypeRepositoryMock.Verify(
                r => r.ListAllAsync(),
                Times.Once);

            _balanceRepositoryMock.Verify(
                r => r.AddAsync(It.IsAny<EmployeeLeaveBalance>()),
                Times.Exactly(2));

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Once);

            _cacheServiceMock.Verify(
                c => c.RemoveAsync(CacheKeys.HRDashboard),
                Times.Once);

            _tokenServiceMock.Verify(
                t => t.GenerateTokenAsync(It.IsAny<Employee>()),
                Times.Once);
        }

        [Fact]
        public async Task RegisterAsync_WhenSuccessful_ShouldCreateBalanceForEachLeaveType()
        {
            // Arrange
            var dto = new RegisterRequestDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@example.com",
                Password = "Password123!",
                DepartmentId = Guid.NewGuid()
            };

            var annualLeave = new LeaveType
            {
                Id = Guid.NewGuid(),
                Name = "Annual",
                DefaultDays = 21
            };

            var sickLeave = new LeaveType
            {
                Id = Guid.NewGuid(),
                Name = "Sick",
                DefaultDays = 14
            };

            var unpaidLeave = new LeaveType
            {
                Id = Guid.NewGuid(),
                Name = "Unpaid",
                DefaultDays = 0
            };

            var leaveTypes = new List<LeaveType>
        {
            annualLeave,
            sickLeave,
            unpaidLeave
        };

            _registerValidatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _userManagerMock
                .Setup(u => u.CreateAsync(
                    It.IsAny<Employee>(),
                    dto.Password))
                .ReturnsAsync(IdentityResult.Success);

            _userManagerMock
                .Setup(u => u.AddToRoleAsync(
                    It.IsAny<Employee>(),
                    Roles.Employee))
                .ReturnsAsync(IdentityResult.Success);

            _leaveTypeRepositoryMock
                .Setup(r => r.ListAllAsync())
                .ReturnsAsync(leaveTypes);

            _balanceRepositoryMock
                .Setup(r => r.AddAsync(
                    It.IsAny<EmployeeLeaveBalance>()))
                .Returns(Task.CompletedTask);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            _cacheServiceMock
                .Setup(c => c.RemoveAsync(CacheKeys.HRDashboard))
                .Returns(Task.CompletedTask);

            _tokenServiceMock
                .Setup(t => t.GenerateTokenAsync(It.IsAny<Employee>()))
                .ReturnsAsync("token");

            // Act
            await _service.RegisterAsync(dto);

            // Assert
            _balanceRepositoryMock.Verify(
                r => r.AddAsync(
                    It.Is<EmployeeLeaveBalance>(b =>
                        b.LeaveTypeId == annualLeave.Id &&
                        b.RemainingDays == annualLeave.DefaultDays)),
                Times.Once);

            _balanceRepositoryMock.Verify(
                r => r.AddAsync(
                    It.Is<EmployeeLeaveBalance>(b =>
                        b.LeaveTypeId == sickLeave.Id &&
                        b.RemainingDays == sickLeave.DefaultDays)),
                Times.Once);

            _balanceRepositoryMock.Verify(
                r => r.AddAsync(
                    It.Is<EmployeeLeaveBalance>(b =>
                        b.LeaveTypeId == unpaidLeave.Id &&
                        b.RemainingDays == unpaidLeave.DefaultDays)),
                Times.Once);
        }

        #endregion

        #region LoginAsync

        [Fact]
        public async Task LoginAsync_WhenValidationFails_ShouldThrowBadRequestException()
        {
            // Arrange
            var dto = new LoginRequestDto
            {
                Email = "invalid-email",
                Password = "password"
            };

            var validationResult = new ValidationResult(
            [
                new ValidationFailure(
                nameof(LoginRequestDto.Email),
                "Invalid email.")
            ]);

            _loginValidatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(validationResult);

            // Act
            var act = () => _service.LoginAsync(dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _userManagerMock.Verify(
                u => u.FindByEmailAsync(It.IsAny<string>()),
                Times.Never);
        }

        [Fact]
        public async Task LoginAsync_WhenEmailDoesNotExist_ShouldThrowInvalidCredentialsException()
        {
            // Arrange
            var dto = new LoginRequestDto
            {
                Email = "john@example.com",
                Password = "Password123!"
            };

            _loginValidatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _userManagerMock
                .Setup(u => u.FindByEmailAsync(dto.Email))
                .ReturnsAsync((Employee?)null);

            // Act
            var act = () => _service.LoginAsync(dto);

            // Assert
            await act.Should().ThrowAsync<InvalidCredentialsException>();

            _signInManagerMock.Verify(
                s => s.CheckPasswordSignInAsync(
                    It.IsAny<Employee>(),
                    It.IsAny<string>(),
                    It.IsAny<bool>()),
                Times.Never);

            _tokenServiceMock.Verify(
                t => t.GenerateTokenAsync(It.IsAny<Employee>()),
                Times.Never);
        }

        [Fact]
        public async Task LoginAsync_WhenPasswordIsIncorrect_ShouldThrowInvalidCredentialsException()
        {
            // Arrange
            var dto = new LoginRequestDto
            {
                Email = "john@example.com",
                Password = "WrongPassword!"
            };

            var user = new Employee
            {
                Id = Guid.NewGuid(),
                FirstName = "John",
                LastName = "Doe",
                Email = dto.Email,
                UserName = dto.Email
            };

            _loginValidatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _userManagerMock
                .Setup(u => u.FindByEmailAsync(dto.Email))
                .ReturnsAsync(user);

            _signInManagerMock
                .Setup(s => s.CheckPasswordSignInAsync(
                    user,
                    dto.Password,
                    false))
                .ReturnsAsync(SignInResult.Failed);

            // Act
            var act = () => _service.LoginAsync(dto);

            // Assert
            await act.Should().ThrowAsync<InvalidCredentialsException>();

            _tokenServiceMock.Verify(
                t => t.GenerateTokenAsync(It.IsAny<Employee>()),
                Times.Never);
        }

        [Fact]
        public async Task LoginAsync_WhenCredentialsAreValid_ShouldReturnAuthResponse()
        {
            // Arrange
            var dto = new LoginRequestDto
            {
                Email = "john@example.com",
                Password = "Password123!"
            };

            var user = new Employee
            {
                Id = Guid.NewGuid(),
                FirstName = "John",
                LastName = "Doe",
                Email = dto.Email,
                UserName = dto.Email
            };

            const string expectedToken = "generated-token";

            _loginValidatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _userManagerMock
                .Setup(u => u.FindByEmailAsync(dto.Email))
                .ReturnsAsync(user);

            _signInManagerMock
                .Setup(s => s.CheckPasswordSignInAsync(
                    user,
                    dto.Password,
                    false))
                .ReturnsAsync(SignInResult.Success);

            _tokenServiceMock
                .Setup(t => t.GenerateTokenAsync(user))
                .ReturnsAsync(expectedToken);

            // Act
            var result = await _service.LoginAsync(dto);

            // Assert
            result.Should().NotBeNull();
            result.Email.Should().Be(dto.Email);
            result.FullName.Should().Be("John Doe");
            result.Token.Should().Be(expectedToken);

            _userManagerMock.Verify(
                u => u.FindByEmailAsync(dto.Email),
                Times.Once);

            _signInManagerMock.Verify(
                s => s.CheckPasswordSignInAsync(
                    user,
                    dto.Password,
                    false),
                Times.Once);

            _tokenServiceMock.Verify(
                t => t.GenerateTokenAsync(user),
                Times.Once);
        }

        #endregion
    }
}
