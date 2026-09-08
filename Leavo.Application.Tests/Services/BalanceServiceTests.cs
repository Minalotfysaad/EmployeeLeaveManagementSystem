using AutoMapper;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Leavo.Application.Abstractions.Persistence;
using Leavo.Application.DTOs.Balance;
using Leavo.Application.Exceptions;
using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using Leavo.Infrastructure.Services;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Tests.Services
{
    public class BalanceServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IValidator<UpdateBalanceDto>> _validatorMock = new();
        private readonly Mock<IGenericRepository<Employee>> _employeeRepositoryMock = new();
        private readonly Mock<IGenericRepository<EmployeeLeaveBalance>> _balanceRepositoryMock = new();

        private readonly BalanceService _service;

        public BalanceServiceTests()
        {
            _unitOfWorkMock
                .Setup(u => u.Repository<Employee>())
                .Returns(_employeeRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(u => u.Repository<EmployeeLeaveBalance>())
                .Returns(_balanceRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            _service = new BalanceService(
                _unitOfWorkMock.Object,
                _mapperMock.Object,
                NullLogger<BalanceService>.Instance,
                _validatorMock.Object);
        }

        #region GetBalancesAsync

        [Fact]
        public async Task GetBalancesAsync_WhenEmployeeDoesNotExist_ShouldThrowNotFoundException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();

            _employeeRepositoryMock
                .Setup(r => r.AnyAsync(It.IsAny<ISpecification<Employee>>()))
                .ReturnsAsync(false);

            // Act
            var act = () => _service.GetBalancesAsync(employeeId);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();

            _balanceRepositoryMock.Verify(
                r => r.ListAsync(It.IsAny<ISpecification<EmployeeLeaveBalance>>()),
                Times.Never);
        }

        [Fact]
        public async Task GetBalancesAsync_WhenEmployeeExists_ShouldReturnMappedBalances()
        {
            // Arrange
            var employeeId = Guid.NewGuid();

            var balances = new List<EmployeeLeaveBalance>
        {
            new EmployeeLeaveBalance
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId,
                RemainingDays = 10
            },
            new EmployeeLeaveBalance
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId,
                RemainingDays = 5
            }
        };

            var expectedDtos = new List<BalanceDto>
        {
            new BalanceDto
            {
                LeaveTypeId = balances[0].Id,
                RemainingDays = 10
            },
            new BalanceDto
            {
                LeaveTypeId = balances[1].Id,
                RemainingDays = 5
            }
        };

            _employeeRepositoryMock
                .Setup(r => r.AnyAsync(It.IsAny<ISpecification<Employee>>()))
                .ReturnsAsync(true);

            _balanceRepositoryMock
                .Setup(r => r.ListAsync(It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(balances);

            _mapperMock
                .Setup(m => m.Map<List<BalanceDto>>(balances))
                .Returns(expectedDtos);

            // Act
            var result = await _service.GetBalancesAsync(employeeId);

            // Assert
            result.Should().BeEquivalentTo(expectedDtos);

            _balanceRepositoryMock.Verify(
                r => r.ListAsync(It.IsAny<ISpecification<EmployeeLeaveBalance>>()),
                Times.Once);

            _mapperMock.Verify(
                m => m.Map<List<BalanceDto>>(balances),
                Times.Once);
        }

        [Fact]
        public async Task GetBalancesAsync_WhenRepositoryReturnsNull_ShouldThrowNotFoundException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();

            _employeeRepositoryMock
                .Setup(r => r.AnyAsync(It.IsAny<ISpecification<Employee>>()))
                .ReturnsAsync(true);

            _balanceRepositoryMock
                .Setup(r => r.ListAsync(It.IsAny<ISpecification<EmployeeLeaveBalance>>()))!
                .ReturnsAsync((List<EmployeeLeaveBalance>?)null);

            // Act
            var act = () => _service.GetBalancesAsync(employeeId);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();
        }

        #endregion

        #region GetBalanceAsync

        [Fact]
        public async Task GetBalanceAsync_WhenEmployeeDoesNotExist_ShouldThrowNotFoundException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            _employeeRepositoryMock
                .Setup(r => r.AnyAsync(It.IsAny<ISpecification<Employee>>()))
                .ReturnsAsync(false);

            // Act
            var act = () => _service.GetBalanceAsync(employeeId, leaveTypeId);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();

            _balanceRepositoryMock.Verify(
                r => r.FirstOrDefaultAsync(It.IsAny<ISpecification<EmployeeLeaveBalance>>()),
                Times.Never);
        }

        [Fact]
        public async Task GetBalanceAsync_WhenBalanceDoesNotExist_ShouldThrowNotFoundException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            _employeeRepositoryMock
                .Setup(r => r.AnyAsync(It.IsAny<ISpecification<Employee>>()))
                .ReturnsAsync(true);

            _balanceRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync((EmployeeLeaveBalance?)null);

            // Act
            var act = () => _service.GetBalanceAsync(employeeId, leaveTypeId);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();
        }

        [Fact]
        public async Task GetBalanceAsync_WhenBalanceExists_ShouldReturnMappedBalance()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var balance = new EmployeeLeaveBalance
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId,
                LeaveTypeId = leaveTypeId,
                RemainingDays = 10
            };

            var expectedDto = new BalanceDto
            {
                LeaveTypeId = balance.Id,
                RemainingDays = 10
            };

            _employeeRepositoryMock
                .Setup(r => r.AnyAsync(It.IsAny<ISpecification<Employee>>()))
                .ReturnsAsync(true);

            _balanceRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(balance);

            _mapperMock
                .Setup(m => m.Map<BalanceDto>(balance))
                .Returns(expectedDto);

            // Act
            var result = await _service.GetBalanceAsync(employeeId, leaveTypeId);

            // Assert
            result.Should().BeEquivalentTo(expectedDto);

            _mapperMock.Verify(
                m => m.Map<BalanceDto>(balance),
                Times.Once);
        }

        #endregion

        #region UpdateBalanceAsync

        [Fact]
        public async Task UpdateBalanceAsync_WhenValidationFails_ShouldThrowBadRequestException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var dto = new UpdateBalanceDto
            {
                RemainingDays = -5
            };

            var validationResult = new ValidationResult(
            [
                new ValidationFailure(
                nameof(UpdateBalanceDto.RemainingDays),
                "Remaining days cannot be negative.")
            ]);

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<UpdateBalanceDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(validationResult);

            // Act
            var act = () => _service.UpdateBalanceAsync(
                employeeId,
                leaveTypeId,
                dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _employeeRepositoryMock.Verify(
                r => r.AnyAsync(It.IsAny<ISpecification<Employee>>()),
                Times.Never);

            _balanceRepositoryMock.Verify(
                r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task UpdateBalanceAsync_WhenEmployeeDoesNotExist_ShouldThrowNotFoundException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var dto = new UpdateBalanceDto
            {
                RemainingDays = 10
            };

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<UpdateBalanceDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _employeeRepositoryMock
                .Setup(r => r.AnyAsync(It.IsAny<ISpecification<Employee>>()))
                .ReturnsAsync(false);

            // Act
            var act = () => _service.UpdateBalanceAsync(
                employeeId,
                leaveTypeId,
                dto);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();

            _balanceRepositoryMock.Verify(
                r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task UpdateBalanceAsync_WhenBalanceDoesNotExist_ShouldThrowNotFoundException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var dto = new UpdateBalanceDto
            {
                RemainingDays = 10
            };

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<UpdateBalanceDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _employeeRepositoryMock
                .Setup(r => r.AnyAsync(It.IsAny<ISpecification<Employee>>()))
                .ReturnsAsync(true);

            _balanceRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync((EmployeeLeaveBalance?)null);

            // Act
            var act = () => _service.UpdateBalanceAsync(
                employeeId,
                leaveTypeId,
                dto);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task UpdateBalanceAsync_WhenValid_ShouldUpdateBalanceAndSaveChanges()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var balance = new EmployeeLeaveBalance
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId,
                LeaveTypeId = leaveTypeId,
                RemainingDays = 10
            };

            var dto = new UpdateBalanceDto
            {
                RemainingDays = 15
            };

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<UpdateBalanceDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _employeeRepositoryMock
                .Setup(r => r.AnyAsync(It.IsAny<ISpecification<Employee>>()))
                .ReturnsAsync(true);

            _balanceRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(balance);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            // Act
            await _service.UpdateBalanceAsync(
                employeeId,
                leaveTypeId,
                dto);

            // Assert
            balance.RemainingDays.Should().Be(15);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Once);

            _validatorMock.Verify(
                v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()),
                Times.Once);

            _balanceRepositoryMock.Verify(
                r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()),
                Times.Once);
        }

        #endregion
    }
}
