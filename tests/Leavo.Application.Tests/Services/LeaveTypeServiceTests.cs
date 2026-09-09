using AutoMapper;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Leavo.Application.Abstractions.Persistence;
using Leavo.Application.DTOs.LeaveType;
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
    public class LeaveTypeServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IValidator<CreateLeaveTypeDto>> _createValidatorMock = new();
        private readonly Mock<IValidator<UpdateLeaveTypeDto>> _updateValidatorMock = new();

        private readonly Mock<IGenericRepository<LeaveType>> _leaveTypeRepositoryMock = new();
        private readonly Mock<IGenericRepository<EmployeeLeaveBalance>> _balanceRepositoryMock = new();
        private readonly Mock<IGenericRepository<LeaveRequest>> _leaveRequestRepositoryMock = new();

        private readonly LeaveTypeService _service;

        public LeaveTypeServiceTests()
        {
            _unitOfWorkMock
                .Setup(u => u.Repository<LeaveType>())
                .Returns(_leaveTypeRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(u => u.Repository<EmployeeLeaveBalance>())
                .Returns(_balanceRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(u => u.Repository<LeaveRequest>())
                .Returns(_leaveRequestRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            _service = new LeaveTypeService(
                _unitOfWorkMock.Object,
                _mapperMock.Object,
                NullLogger<LeaveTypeService>.Instance,
                _createValidatorMock.Object,
                _updateValidatorMock.Object);
        }


        #region GetByIdAsync

        [Fact]
        public async Task GetByIdAsync_ShouldReturnLeaveType_WhenLeaveTypeExists()
        {
            // Arrange
            var leaveTypeId = Guid.NewGuid();

            var leaveType = new LeaveType
            {
                Id = leaveTypeId,
                Name = "Annual Leave",
                DefaultDays = 21
            };

            var expectedDto = new LeaveTypeDetailsDto
            {
                Id = leaveTypeId,
                Name = "Annual Leave",
                DefaultDays = 21
            };

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(leaveType);

            _mapperMock
                .Setup(m => m.Map<LeaveTypeDetailsDto>(leaveType))
                .Returns(expectedDto);

            // Act
            var result = await _service.GetByIdAsync(leaveTypeId);

            // Assert
            result.Should().BeSameAs(expectedDto);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldThrowNotFoundException_WhenLeaveTypeDoesNotExist()
        {
            // Arrange
            var leaveTypeId = Guid.NewGuid();

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync((LeaveType?)null);

            // Act
            Func<Task> act = () => _service.GetByIdAsync(leaveTypeId);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();
        }

        #endregion


        #region CreateAsync

        [Fact]
        public async Task CreateAsync_ShouldThrowBadRequestException_WhenValidationFails()
        {
            // Arrange
            var dto = new CreateLeaveTypeDto
            {
                Name = "",
                DefaultDays = 0
            };

            var validationResult = new ValidationResult(
            [
                new ValidationFailure("Name", "Name is required.")
            ]);

            _createValidatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<CreateLeaveTypeDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(validationResult);

            // Act
            Func<Task> act = () => _service.CreateAsync(dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _leaveTypeRepositoryMock.Verify(
                r => r.AddAsync(It.IsAny<LeaveType>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task CreateAsync_ShouldThrowBadRequestException_WhenDuplicateLeaveTypeExists()
        {
            // Arrange
            var dto = new CreateLeaveTypeDto
            {
                Name = "Annual Leave",
                DefaultDays = 21
            };

            _createValidatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<CreateLeaveTypeDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(true);

            // Act
            Func<Task> act = () => _service.CreateAsync(dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _leaveTypeRepositoryMock.Verify(
                r => r.AddAsync(It.IsAny<LeaveType>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task CreateAsync_ShouldTrimNameAndCreateLeaveType_WhenDataIsValid()
        {
            // Arrange
            var dto = new CreateLeaveTypeDto
            {
                Name = "  Annual Leave  ",
                Description = "Annual vacation leave",
                DefaultDays = 21
            };

            var leaveType = new LeaveType
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                DefaultDays = dto.DefaultDays
            };

            var expectedDto = new LeaveTypeDetailsDto
            {
                Id = leaveType.Id,
                Name = "Annual Leave",
                Description = dto.Description,
                DefaultDays = dto.DefaultDays
            };

            _createValidatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<CreateLeaveTypeDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(false);

            _mapperMock
                .Setup(m => m.Map<LeaveType>(dto))
                .Returns(leaveType);

            _leaveTypeRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<LeaveType>()))
                .Returns(Task.CompletedTask);

            _mapperMock
                .Setup(m => m.Map<LeaveTypeDetailsDto>(leaveType))
                .Returns(expectedDto);

            // Act
            var result = await _service.CreateAsync(dto);

            // Assert
            result.Should().BeSameAs(expectedDto);

            leaveType.Name.Should().Be("Annual Leave");

            _leaveTypeRepositoryMock.Verify(
                r => r.AddAsync(It.Is<LeaveType>(
                    lt => lt.Name == "Annual Leave")),
                Times.Once);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Once);
        }

        #endregion


        #region UpdateAsync

        [Fact]
        public async Task UpdateAsync_ShouldThrowBadRequestException_WhenValidationFails()
        {
            // Arrange
            var leaveTypeId = Guid.NewGuid();

            var dto = new UpdateLeaveTypeDto
            {
                Name = "",
                DefaultDays = 0
            };

            var validationResult = new ValidationResult(
            [
                new ValidationFailure("Name", "Name is required.")
            ]);

            _updateValidatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<UpdateLeaveTypeDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(validationResult);

            // Act
            Func<Task> act = () => _service.UpdateAsync(leaveTypeId, dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowNotFoundException_WhenLeaveTypeDoesNotExist()
        {
            // Arrange
            var leaveTypeId = Guid.NewGuid();

            var dto = new UpdateLeaveTypeDto
            {
                Name = "Annual Leave",
                DefaultDays = 21
            };

            _updateValidatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<UpdateLeaveTypeDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync((LeaveType?)null);

            // Act
            Func<Task> act = () => _service.UpdateAsync(leaveTypeId, dto);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowBadRequestException_WhenAnotherLeaveTypeHasSameName()
        {
            // Arrange
            var leaveTypeId = Guid.NewGuid();

            var dto = new UpdateLeaveTypeDto
            {
                Name = "Annual Leave",
                DefaultDays = 21
            };

            var existingLeaveType = new LeaveType
            {
                Id = leaveTypeId,
                Name = "Sick Leave",
                DefaultDays = 14
            };

            _updateValidatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<UpdateLeaveTypeDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(existingLeaveType);

            _leaveTypeRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(true);

            // Act
            Func<Task> act = () => _service.UpdateAsync(leaveTypeId, dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task UpdateAsync_ShouldTrimAndUpdateLeaveType_WhenDataIsValid()
        {
            // Arrange
            var leaveTypeId = Guid.NewGuid();

            var dto = new UpdateLeaveTypeDto
            {
                Name = "  Updated Annual Leave  ",
                Description = "Updated description",
                DefaultDays = 25
            };

            var leaveType = new LeaveType
            {
                Id = leaveTypeId,
                Name = "Annual Leave",
                Description = "Old description",
                DefaultDays = 21
            };

            _updateValidatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<UpdateLeaveTypeDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(leaveType);

            _leaveTypeRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(false);

            // Act
            await _service.UpdateAsync(leaveTypeId, dto);

            // Assert
            leaveType.Name.Should().Be("Updated Annual Leave");
            leaveType.Description.Should().Be("Updated description");
            leaveType.DefaultDays.Should().Be(25);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Once);
        }

        #endregion


        #region DeleteAsync

        [Fact]
        public async Task DeleteAsync_ShouldThrowNotFoundException_WhenLeaveTypeDoesNotExist()
        {
            // Arrange
            var leaveTypeId = Guid.NewGuid();

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync((LeaveType?)null);

            // Act
            Func<Task> act = () => _service.DeleteAsync(leaveTypeId);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();
        }

        [Fact]
        public async Task DeleteAsync_ShouldThrowBadRequestException_WhenLeaveTypeHasEmployeeBalances()
        {
            // Arrange
            var leaveTypeId = Guid.NewGuid();

            var leaveType = new LeaveType
            {
                Id = leaveTypeId,
                Name = "Annual Leave"
            };

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(leaveType);

            _balanceRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(true);

            _leaveRequestRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(false);

            // Act
            Func<Task> act = () => _service.DeleteAsync(leaveTypeId);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _leaveTypeRepositoryMock.Verify(
                r => r.Remove(It.IsAny<LeaveType>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task DeleteAsync_ShouldThrowBadRequestException_WhenLeaveTypeHasLeaveRequests()
        {
            // Arrange
            var leaveTypeId = Guid.NewGuid();

            var leaveType = new LeaveType
            {
                Id = leaveTypeId,
                Name = "Annual Leave"
            };

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(leaveType);

            _balanceRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(false);

            _leaveRequestRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(true);

            // Act
            Func<Task> act = () => _service.DeleteAsync(leaveTypeId);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _leaveTypeRepositoryMock.Verify(
                r => r.Remove(It.IsAny<LeaveType>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task DeleteAsync_ShouldDeleteLeaveType_WhenLeaveTypeIsNotInUse()
        {
            // Arrange
            var leaveTypeId = Guid.NewGuid();

            var leaveType = new LeaveType
            {
                Id = leaveTypeId,
                Name = "Annual Leave"
            };

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(leaveType);

            _balanceRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(false);

            _leaveRequestRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(false);

            // Act
            await _service.DeleteAsync(leaveTypeId);

            // Assert
            _leaveTypeRepositoryMock.Verify(
                r => r.Remove(leaveType),
                Times.Once);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Once);
        }

        #endregion
    }
}
