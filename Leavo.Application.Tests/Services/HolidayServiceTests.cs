using AutoMapper;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Leavo.Application.Abstractions.Caching;
using Leavo.Application.Abstractions.Persistence;
using Leavo.Application.Abstractions.Services;
using Leavo.Application.DTOs.Holiday;
using Leavo.Application.Exceptions;
using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using Leavo.Infrastructure.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Tests.Services
{
    public class HolidayServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock = new(); 
        private readonly Mock<ICacheService> _cacheServiceMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IValidator<CreateHolidayDto>> _createValidatorMock = new();
        private readonly Mock<IValidator<UpdateHolidayDto>> _updateValidatorMock = new();
        private readonly Mock<IGenericRepository<Holiday>> _holidayRepositoryMock = new();
        private readonly HolidayService _service;

        public HolidayServiceTests()
        {
            _unitOfWorkMock
                .Setup(u => u.Repository<Holiday>())
                .Returns(_holidayRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            _cacheServiceMock
                .Setup(c => c.RemoveAsync(It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            _service = new HolidayService(
                _unitOfWorkMock.Object,
                _cacheServiceMock.Object,
                _mapperMock.Object,
                NullLogger<HolidayService>.Instance,
                _createValidatorMock.Object,
                _updateValidatorMock.Object);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnHoliday_WhenHolidayExists()
        {
            // Arrange
            var holidayId = Guid.NewGuid();

            var holiday = new Holiday
            {
                Id = holidayId,
                Name = "Christmas",
                StartDate = DateTime.UtcNow.AddDays(10),
                EndDate = DateTime.UtcNow.AddDays(11)
            };

            var expectedDto = new HolidayDetailsDto
            {
                Id = holidayId,
                Name = "Christmas"
            };

            _holidayRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<Holiday>>()))
                .ReturnsAsync(holiday);

            _mapperMock
                .Setup(m => m.Map<HolidayDetailsDto>(holiday))
                .Returns(expectedDto);

            // Act
            var result = await _service.GetByIdAsync(holidayId);

            // Assert
            result.Should().NotBeNull();
            result.Should().BeSameAs(expectedDto);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldThrowNotFoundException_WhenHolidayDoesNotExist()
        {
            // Arrange
            var holidayId = Guid.NewGuid();

            _holidayRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<Holiday>>()))
                .ReturnsAsync((Holiday?)null);

            // Act
            Func<Task> act = () => _service.GetByIdAsync(holidayId);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();
        }

        [Fact]
        public async Task CreateAsync_ShouldThrowBadRequestException_WhenValidationFails()
        {
            // Arrange
            var dto = new CreateHolidayDto
            {
                Name = "",
                StartDate = DateTime.UtcNow.AddDays(10),
                EndDate = DateTime.UtcNow.AddDays(11)
            };

            var validationResult = new ValidationResult(
            [
                new ValidationFailure("Name", "Name is required.")
            ]);

            _createValidatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<CreateHolidayDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(validationResult);

            // Act
            Func<Task> act = () => _service.CreateAsync(Guid.NewGuid(), dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _holidayRepositoryMock.Verify(
                r => r.AddAsync(It.IsAny<Holiday>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task CreateAsync_ShouldThrowBadRequestException_WhenHolidayAlreadyExists()
        {
            // Arrange
            var dto = new CreateHolidayDto
            {
                Name = "Christmas",
                StartDate = DateTime.UtcNow.AddDays(10),
                EndDate = DateTime.UtcNow.AddDays(11)
            };

            _createValidatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<CreateHolidayDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _holidayRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<Holiday>>()))
                .ReturnsAsync(true);

            // Act
            Func<Task> act = () => _service.CreateAsync(Guid.NewGuid(), dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _holidayRepositoryMock.Verify(
                r => r.AddAsync(It.IsAny<Holiday>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }


        [Fact]
        public async Task CreateAsync_ShouldCreateHoliday_WhenDataIsValid()
        {
            // Arrange
            var hrId = Guid.NewGuid();

            var dto = new CreateHolidayDto
            {
                Name = " Christmas ",
                StartDate = DateTime.UtcNow.AddDays(10),
                EndDate = DateTime.UtcNow.AddDays(11)
            };

            var holiday = new Holiday
            {
                Id = Guid.NewGuid(),
                Name = "Christmas",
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };

            var expectedDto = new HolidayDetailsDto
            {
                Id = holiday.Id,
                Name = "Christmas"
            };

            _createValidatorMock
                .Setup(v => v.ValidateAsync(
                    It.IsAny<CreateHolidayDto>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _holidayRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<Holiday>>()))
                .ReturnsAsync(false);

            _mapperMock
                .Setup(m => m.Map<Holiday>(dto))
                .Returns(holiday);

            _holidayRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Holiday>()))
                .Returns(Task.CompletedTask);

            _holidayRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<Holiday>>()))
                .ReturnsAsync(holiday);

            _mapperMock
                .Setup(m => m.Map<HolidayDetailsDto>(holiday))
                .Returns(expectedDto);

            // Act
            var result = await _service.CreateAsync(hrId, dto);

            // Assert
            result.Should().BeSameAs(expectedDto);

            holiday.Name.Should().Be("Christmas");
            holiday.CreatedById.Should().Be(hrId);

            _holidayRepositoryMock.Verify(
                r => r.AddAsync(It.Is<Holiday>(h =>
                    h.Name == "Christmas" &&
                    h.CreatedById == hrId)),
                Times.Once);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Once);

            _cacheServiceMock.Verify(
                c => c.RemoveAsync("dashboard:hr"),
                Times.Once);
        }
    }
}
