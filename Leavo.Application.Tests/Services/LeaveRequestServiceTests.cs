using AutoMapper;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Leavo.Application.Abstractions.Persistence;
using Leavo.Application.DTOs.Employee;
using Leavo.Application.DTOs.LeaveRequest;
using Leavo.Application.Exceptions;
using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using Leavo.Domain.Enums;
using Leavo.Infrastructure.Services;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Tests.Services
{
    public class LeaveRequestServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ILogger<LeaveRequestService>> _loggerMock;
        private readonly Mock<IValidator<CreateLeaveRequestDto>> _validatorMock;

        private readonly Mock<IGenericRepository<LeaveType>> _leaveTypeRepositoryMock;
        private readonly Mock<IGenericRepository<EmployeeLeaveBalance>> _balanceRepositoryMock;
        private readonly Mock<IGenericRepository<LeaveRequest>> _leaveRequestRepositoryMock;

        private readonly LeaveRequestService _service;

        public LeaveRequestServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _loggerMock = new Mock<ILogger<LeaveRequestService>>();
            _validatorMock = new Mock<IValidator<CreateLeaveRequestDto>>();

            _leaveTypeRepositoryMock =
                new Mock<IGenericRepository<LeaveType>>();

            _balanceRepositoryMock =
                new Mock<IGenericRepository<EmployeeLeaveBalance>>();

            _leaveRequestRepositoryMock =
                new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(u => u.Repository<LeaveType>())
                .Returns(_leaveTypeRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(u => u.Repository<EmployeeLeaveBalance>())
                .Returns(_balanceRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(u => u.Repository<LeaveRequest>())
                .Returns(_leaveRequestRepositoryMock.Object);

            _service = new LeaveRequestService(
                _unitOfWorkMock.Object,
                _mapperMock.Object,
                _loggerMock.Object,
                _validatorMock.Object);
        }

        #region CreateLeaveRequestAsync

        [Fact]
        public async Task CreateLeaveRequestAsync_WhenValidationFails_ShouldThrowBadRequestException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();

            var dto = new CreateLeaveRequestDto
            {
                LeaveTypeId = Guid.NewGuid(),
                StartDate = new DateOnly(2026, 9, 10),
                EndDate = new DateOnly(2026, 9, 12)
            };

            var validationResult = new ValidationResult(
            [
                new ValidationFailure(
                nameof(CreateLeaveRequestDto.EndDate),
                "End date must be greater than or equal to start date.")
            ]);

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(validationResult);

            // Act
            var act = () => _service.CreateLeaveRequestAsync(employeeId, dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _leaveTypeRepositoryMock.Verify(
                r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()),
                Times.Never);

            _balanceRepositoryMock.Verify(
                r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()),
                Times.Never);

            _leaveRequestRepositoryMock.Verify(
                r => r.AddAsync(It.IsAny<LeaveRequest>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task CreateLeaveRequestAsync_WhenLeaveTypeDoesNotExist_ShouldThrowNotFoundException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();

            var dto = new CreateLeaveRequestDto
            {
                LeaveTypeId = Guid.NewGuid(),
                StartDate = new DateOnly(2026, 9, 10),
                EndDate = new DateOnly(2026, 9, 12)
            };

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync((LeaveType?)null);

            // Act
            var act = () => _service.CreateLeaveRequestAsync(employeeId, dto);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();

            _balanceRepositoryMock.Verify(
                r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()),
                Times.Never);

            _leaveRequestRepositoryMock.Verify(
                r => r.AddAsync(It.IsAny<LeaveRequest>()),
                Times.Never);
        }

        [Fact]
        public async Task CreateLeaveRequestAsync_WhenEmployeeHasNoLeaveBalance_ShouldThrowBadRequestException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var dto = new CreateLeaveRequestDto
            {
                LeaveTypeId = leaveTypeId,
                StartDate = new DateOnly(2026, 9, 10),
                EndDate = new DateOnly(2026, 9, 12)
            };

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(new LeaveType
                {
                    Id = leaveTypeId,
                    Name = "Annual",
                    DefaultDays = 21
                });

            _balanceRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync((EmployeeLeaveBalance?)null);

            // Act
            var act = () => _service.CreateLeaveRequestAsync(employeeId, dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _leaveRequestRepositoryMock.Verify(
                r => r.AnyAsync(It.IsAny<ISpecification<LeaveRequest>>()),
                Times.Never);

            _leaveRequestRepositoryMock.Verify(
                r => r.AddAsync(It.IsAny<LeaveRequest>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task CreateLeaveRequestAsync_WhenRequestedDaysExceedBalance_ShouldThrowBadRequestException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var dto = new CreateLeaveRequestDto
            {
                LeaveTypeId = leaveTypeId,
                StartDate = new DateOnly(2026, 9, 10),
                EndDate = new DateOnly(2026, 9, 15)
            };

            var balance = new EmployeeLeaveBalance
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId,
                LeaveTypeId = leaveTypeId,
                RemainingDays = 3
            };

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(new LeaveType
                {
                    Id = leaveTypeId,
                    Name = "Annual",
                    DefaultDays = 21
                });

            _balanceRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(balance);

            // Act
            var act = () => _service.CreateLeaveRequestAsync(employeeId, dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _leaveRequestRepositoryMock.Verify(
                r => r.AnyAsync(It.IsAny<ISpecification<LeaveRequest>>()),
                Times.Never);

            _leaveRequestRepositoryMock.Verify(
                r => r.AddAsync(It.IsAny<LeaveRequest>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task CreateLeaveRequestAsync_WhenLeavePeriodOverlaps_ShouldThrowBadRequestException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var dto = new CreateLeaveRequestDto
            {
                LeaveTypeId = leaveTypeId,
                StartDate = new DateOnly(2026, 9, 10),
                EndDate = new DateOnly(2026, 9, 12)
            };

            var balance = new EmployeeLeaveBalance
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId,
                LeaveTypeId = leaveTypeId,
                RemainingDays = 20
            };

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(new LeaveType
                {
                    Id = leaveTypeId,
                    Name = "Annual",
                    DefaultDays = 21
                });

            _balanceRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(balance);

            _leaveRequestRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(true);

            // Act
            var act = () => _service.CreateLeaveRequestAsync(employeeId, dto);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            _leaveRequestRepositoryMock.Verify(
                r => r.AddAsync(It.IsAny<LeaveRequest>()),
                Times.Never);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task CreateLeaveRequestAsync_WhenValid_ShouldCreateLeaveRequest()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var dto = new CreateLeaveRequestDto
            {
                LeaveTypeId = leaveTypeId,
                StartDate = new DateOnly(2026, 9, 10),
                EndDate = new DateOnly(2026, 9, 12)
            };

            var balance = new EmployeeLeaveBalance
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId,
                LeaveTypeId = leaveTypeId,
                RemainingDays = 20
            };

            var mappedRequest = new LeaveRequest
            {
                Id = Guid.NewGuid(),
                LeaveTypeId = leaveTypeId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };

            var expectedDto = new LeaveRequestDetailsDto
            {
                Id = mappedRequest.Id
            };

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(new LeaveType
                {
                    Id = leaveTypeId,
                    Name = "Annual",
                    DefaultDays = 21
                });

            _balanceRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(balance);

            _leaveRequestRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(false);

            _mapperMock
                .Setup(m => m.Map<LeaveRequest>(dto))
                .Returns(mappedRequest);

            _leaveRequestRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<LeaveRequest>()))
                .Returns(Task.CompletedTask);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            _mapperMock
                .Setup(m => m.Map<LeaveRequestDetailsDto>(mappedRequest))
                .Returns(expectedDto);

            // Act
            var result = await _service.CreateLeaveRequestAsync(
                employeeId,
                dto);

            // Assert
            result.Should().BeEquivalentTo(expectedDto);

            mappedRequest.EmployeeId.Should().Be(employeeId);
            mappedRequest.Status.Should().Be(RequestStatus.Pending);

            _leaveRequestRepositoryMock.Verify(
                r => r.AddAsync(
                    It.Is<LeaveRequest>(request =>
                        request.EmployeeId == employeeId &&
                        request.LeaveTypeId == leaveTypeId &&
                        request.Status == RequestStatus.Pending &&
                        request.StartDate == dto.StartDate &&
                        request.EndDate == dto.EndDate)),
                Times.Once);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Once);

            _mapperMock.Verify(
                m => m.Map<LeaveRequest>(dto),
                Times.Once);

            _mapperMock.Verify(
                m => m.Map<LeaveRequestDetailsDto>(mappedRequest),
                Times.Once);
        }

        [Fact]
        public async Task CreateLeaveRequestAsync_WhenValid_ShouldCalculateTotalDays()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var dto = new CreateLeaveRequestDto
            {
                LeaveTypeId = leaveTypeId,
                StartDate = new DateOnly(2026, 9, 10),
                EndDate = new DateOnly(2026, 9, 14)
            };

            var balance = new EmployeeLeaveBalance
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId,
                LeaveTypeId = leaveTypeId,
                RemainingDays = 20
            };

            var mappedRequest = new LeaveRequest
            {
                Id = Guid.NewGuid(),
                LeaveTypeId = leaveTypeId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };

            _validatorMock
                .Setup(v => v.ValidateAsync(
                    dto,
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ValidationResult());

            _leaveTypeRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveType>>()))
                .ReturnsAsync(new LeaveType
                {
                    Id = leaveTypeId,
                    Name = "Annual",
                    DefaultDays = 21
                });

            _balanceRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(balance);

            _leaveRequestRepositoryMock
                .Setup(r => r.AnyAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(false);

            _mapperMock
                .Setup(m => m.Map<LeaveRequest>(dto))
                .Returns(mappedRequest);

            _leaveRequestRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<LeaveRequest>()))
                .Returns(Task.CompletedTask);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            _mapperMock
                .Setup(m => m.Map<LeaveRequestDetailsDto>(
                    It.IsAny<LeaveRequest>()))
                .Returns(new LeaveRequestDetailsDto());

            // Act
            await _service.CreateLeaveRequestAsync(employeeId, dto);

            // Assert
            mappedRequest.TotalDays.Should().Be(5);
        }

        #endregion

        #region GetMyLeaveRequestsAsync

        [Fact]
        public async Task GetMyLeaveRequestsAsync_ShouldReturnPagedResults()
        {
            // Arrange
            var employeeId = Guid.NewGuid();

            var parameters = new EmployeeQueryParameters
            {
                Page = 2,
                PageSize = 5
            };

            var leaveRequests = new List<LeaveRequest>
        {
            new LeaveRequest
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId
            },
            new LeaveRequest
            {
                Id = Guid.NewGuid(),
                EmployeeId = employeeId
            }
        };

            var dtos = new List<LeaveRequestDetailsDto>
        {
            new LeaveRequestDetailsDto
            {
                Id = leaveRequests[0].Id
            },
            new LeaveRequestDetailsDto
            {
                Id = leaveRequests[1].Id
            }
        };

            _leaveRequestRepositoryMock
                .Setup(r => r.ListAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequests);

            _leaveRequestRepositoryMock
                .Setup(r => r.CountAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(12);

            _mapperMock
                .Setup(m => m.Map<List<LeaveRequestDetailsDto>>(leaveRequests))
                .Returns(dtos);

            // Act
            var result = await _service.GetMyLeaveRequestsAsync(
                employeeId,
                parameters);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().BeEquivalentTo(dtos);
            result.Page.Should().Be(2);
            result.PageSize.Should().Be(5);
            result.TotalCount.Should().Be(12);

            _leaveRequestRepositoryMock.Verify(
                r => r.ListAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()),
                Times.Once);

            _leaveRequestRepositoryMock.Verify(
                r => r.CountAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()),
                Times.Once);

            _mapperMock.Verify(
                m => m.Map<List<LeaveRequestDetailsDto>>(leaveRequests),
                Times.Once);
        }

        #endregion

        #region GetMyLeaveRequestByIdAsync

        [Fact]
        public async Task GetMyLeaveRequestByIdAsync_WhenRequestDoesNotExist_ShouldThrowNotFoundException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var requestId = Guid.NewGuid();

            _leaveRequestRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync((LeaveRequest?)null);

            // Act
            var act = () => _service.GetMyLeaveRequestByIdAsync(
                employeeId,
                requestId);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();

            _mapperMock.Verify(
                m => m.Map<LeaveRequestDetailsDto>(
                    It.IsAny<LeaveRequest>()),
                Times.Never);
        }

        [Fact]
        public async Task GetMyLeaveRequestByIdAsync_WhenRequestExists_ShouldReturnMappedDto()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var requestId = Guid.NewGuid();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                EmployeeId = employeeId
            };

            var expectedDto = new LeaveRequestDetailsDto
            {
                Id = requestId
            };

            _leaveRequestRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            _mapperMock
                .Setup(m => m.Map<LeaveRequestDetailsDto>(leaveRequest))
                .Returns(expectedDto);

            // Act
            var result = await _service.GetMyLeaveRequestByIdAsync(
                employeeId,
                requestId);

            // Assert
            result.Should().BeEquivalentTo(expectedDto);

            _mapperMock.Verify(
                m => m.Map<LeaveRequestDetailsDto>(leaveRequest),
                Times.Once);
        }

        #endregion

        #region CancelLeaveRequestAsync

        [Fact]
        public async Task CancelLeaveRequestAsync_WhenRequestDoesNotExist_ShouldThrowNotFoundException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var requestId = Guid.NewGuid();

            _leaveRequestRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync((LeaveRequest?)null);

            // Act
            var act = () => _service.CancelLeaveRequestAsync(
                employeeId,
                requestId);

            // Assert
            await act.Should().ThrowAsync<NotFoundException>();

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task CancelLeaveRequestAsync_WhenRequestIsNotPending_ShouldThrowBadRequestException()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var requestId = Guid.NewGuid();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                EmployeeId = employeeId,
                Status = RequestStatus.HRApproved
            };

            _leaveRequestRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            // Act
            var act = () => _service.CancelLeaveRequestAsync(
                employeeId,
                requestId);

            // Assert
            await act.Should().ThrowAsync<BadRequestException>();

            leaveRequest.Status.Should().Be(RequestStatus.HRApproved);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task CancelLeaveRequestAsync_WhenRequestIsPending_ShouldCancelAndSave()
        {
            // Arrange
            var employeeId = Guid.NewGuid();
            var requestId = Guid.NewGuid();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                EmployeeId = employeeId,
                Status = RequestStatus.Pending
            };

            _leaveRequestRepositoryMock
                .Setup(r => r.FirstOrDefaultAsync(
                    It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            // Act
            await _service.CancelLeaveRequestAsync(
                employeeId,
                requestId);

            // Assert
            leaveRequest.Status.Should().Be(RequestStatus.Cancelled);

            _unitOfWorkMock.Verify(
                u => u.SaveChangesAsync(),
                Times.Once);
        }

        #endregion
    }
}
