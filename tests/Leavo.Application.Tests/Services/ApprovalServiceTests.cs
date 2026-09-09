using AutoMapper;
using FluentAssertions;
using Leavo.Application.Abstractions.Caching;
using Leavo.Application.Abstractions.Persistence;
using Leavo.Application.Common.Models.Caching;
using Leavo.Application.DTOs.Approval;
using Leavo.Application.DTOs.Employee;
using Leavo.Application.DTOs.LeaveRequest;
using Leavo.Application.Exceptions;
using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using Leavo.Domain.Enums;
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
    public class ApprovalServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
        private readonly Mock<ICacheService> _cacheServiceMock = new();
        private readonly Mock<IMapper> _mapperMock = new();

        private readonly ApprovalService _sut;

        public ApprovalServiceTests()
        {
            _sut = new ApprovalService(
                _unitOfWorkMock.Object,
                _cacheServiceMock.Object,
                _mapperMock.Object,
                NullLogger<ApprovalService>.Instance);
        }

        #region GetPendingManagerRequestsAsync

        [Fact]
        public async Task GetPendingManagerRequestsAsync_ShouldReturnPagedRequests()
        {
            // Arrange
            var parameters = new EmployeeQueryParameters
            {
                Page = 1,
                PageSize = 10
            };

            var leaveRequests = new List<LeaveRequest>
        {
            new(),
            new()
        };

            var dto = new List<PendingLeaveRequestDto>
        {
            new(),
            new()
        };

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.ListAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequests);

            repositoryMock
                .Setup(x => x.CountAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(2);

            _mapperMock
                .Setup(x => x.Map<List<PendingLeaveRequestDto>>(leaveRequests))
                .Returns(dto);

            // Act
            var result = await _sut.GetPendingManagerRequestsAsync(parameters);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2);
            result.TotalCount.Should().Be(2);
            result.Page.Should().Be(1);
            result.PageSize.Should().Be(10);

            repositoryMock.Verify(
                x => x.ListAsync(It.IsAny<ISpecification<LeaveRequest>>()),
                Times.Once);

            repositoryMock.Verify(
                x => x.CountAsync(It.IsAny<ISpecification<LeaveRequest>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetPendingManagerRequestsAsync_ShouldReturnEmptyResult_WhenNoRequestsExist()
        {
            // Arrange
            var parameters = new EmployeeQueryParameters
            {
                Page = 1,
                PageSize = 10
            };

            var leaveRequests = new List<LeaveRequest>();
            var dto = new List<PendingLeaveRequestDto>();

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.ListAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequests);

            repositoryMock
                .Setup(x => x.CountAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(0);

            _mapperMock
                .Setup(x => x.Map<List<PendingLeaveRequestDto>>(leaveRequests))
                .Returns(dto);

            // Act
            var result = await _sut.GetPendingManagerRequestsAsync(parameters);

            // Assert
            result.Items.Should().BeEmpty();
            result.TotalCount.Should().Be(0);
        }

        #endregion

        #region GetPendingHRRequestsAsync

        [Fact]
        public async Task GetPendingHRRequestsAsync_ShouldReturnPagedRequests()
        {
            // Arrange
            var parameters = new EmployeeQueryParameters
            {
                Page = 1,
                PageSize = 10
            };

            var leaveRequests = new List<LeaveRequest>
        {
            new(),
            new()
        };

            var dto = new List<PendingLeaveRequestDto>
        {
            new(),
            new()
        };

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.ListAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequests);

            repositoryMock
                .Setup(x => x.CountAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(2);

            _mapperMock
                .Setup(x => x.Map<List<PendingLeaveRequestDto>>(leaveRequests))
                .Returns(dto);

            // Act
            var result = await _sut.GetPendingHRRequestsAsync(parameters);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2);
            result.TotalCount.Should().Be(2);
            result.Page.Should().Be(1);
            result.PageSize.Should().Be(10);
        }

        #endregion

        #region ManagerApproveAsync

        [Fact]
        public async Task ManagerApproveAsync_ShouldApprovePendingRequest()
        {
            // Arrange
            var managerId = Guid.NewGuid();
            var requestId = Guid.NewGuid();

            var decision = new ApprovalDecisionDto
            {
                Comment = "Approved by manager"
            };

            var approval = new Approval();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                Status = RequestStatus.Pending,
                Approval = approval
            };

            var leaveRequestRepositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(leaveRequestRepositoryMock.Object);

            leaveRequestRepositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            // Act
            await _sut.ManagerApproveAsync(managerId, requestId, decision);

            // Assert
            leaveRequest.Status.Should().Be(RequestStatus.ManagerApproved);

            approval.ManagerId.Should().Be(managerId);
            approval.ManagerDecision.Should().Be(Decision.Approved);
            approval.ManagerComment.Should().Be(decision.Comment);
            approval.ManagerDecisionDate.Should().NotBe(default);

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Once);

            _cacheServiceMock.Verify(
                x => x.RemoveAsync(CacheKeys.HRDashboard),
                Times.Once);
        }

        [Fact]
        public async Task ManagerApproveAsync_ShouldThrowNotFound_WhenRequestDoesNotExist()
        {
            // Arrange
            var requestId = Guid.NewGuid();

            var decision = new ApprovalDecisionDto();

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync((LeaveRequest?)null);

            // Act
            var act = () => _sut.ManagerApproveAsync(
                Guid.NewGuid(),
                requestId,
                decision);

            // Assert
            await act.Should()
                .ThrowAsync<NotFoundException>();

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Never);

            _cacheServiceMock.Verify(
                x => x.RemoveAsync(It.IsAny<string>()),
                Times.Never);
        }

        [Fact]
        public async Task ManagerApproveAsync_ShouldThrowBadRequest_WhenRequestIsNotPending()
        {
            // Arrange
            var requestId = Guid.NewGuid();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                Status = RequestStatus.RejectedByManager
            };

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            // Act
            var act = () => _sut.ManagerApproveAsync(
                Guid.NewGuid(),
                requestId,
                new ApprovalDecisionDto());

            // Assert
            await act.Should()
                .ThrowAsync<BadRequestException>();

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Never);

            _cacheServiceMock.Verify(
                x => x.RemoveAsync(It.IsAny<string>()),
                Times.Never);
        }

        [Fact]
        public async Task ManagerApproveAsync_ShouldCreateApproval_WhenApprovalDoesNotExist()
        {
            // Arrange
            var managerId = Guid.NewGuid();
            var requestId = Guid.NewGuid();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                Status = RequestStatus.Pending,
                Approval = null
            };

            var leaveRequestRepositoryMock = new Mock<IGenericRepository<LeaveRequest>>();
            var approvalRepositoryMock = new Mock<IGenericRepository<Approval>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(leaveRequestRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(x => x.Repository<Approval>())
                .Returns(approvalRepositoryMock.Object);

            leaveRequestRepositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            // Act
            await _sut.ManagerApproveAsync(
                managerId,
                requestId,
                new ApprovalDecisionDto
                {
                    Comment = "Approved"
                });

            // Assert
            leaveRequest.Approval.Should().NotBeNull();
            leaveRequest.Approval!.LeaveRequestId.Should().Be(requestId);

            approvalRepositoryMock.Verify(
                x => x.AddAsync(It.Is<Approval>(a =>
                    a.LeaveRequestId == requestId)),
                Times.Once);

            leaveRequest.Status.Should().Be(RequestStatus.ManagerApproved);
        }

        #endregion

        #region ManagerRejectAsync

        [Fact]
        public async Task ManagerRejectAsync_ShouldRejectPendingRequest()
        {
            // Arrange
            var managerId = Guid.NewGuid();
            var requestId = Guid.NewGuid();

            var approval = new Approval();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                Status = RequestStatus.Pending,
                Approval = approval
            };

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            // Act
            await _sut.ManagerRejectAsync(
                managerId,
                requestId,
                new ApprovalDecisionDto
                {
                    Comment = "Insufficient justification"
                });

            // Assert
            leaveRequest.Status.Should().Be(RequestStatus.RejectedByManager);

            approval.ManagerId.Should().Be(managerId);
            approval.ManagerDecision.Should().Be(Decision.Rejected);
            approval.ManagerComment.Should().Be("Insufficient justification");
            approval.ManagerDecisionDate.Should().NotBe(default);

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Once);

            _cacheServiceMock.Verify(
                x => x.RemoveAsync(CacheKeys.HRDashboard),
                Times.Once);
        }

        [Fact]
        public async Task ManagerRejectAsync_ShouldThrowBadRequest_WhenRequestIsNotPending()
        {
            // Arrange
            var requestId = Guid.NewGuid();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                Status = RequestStatus.ManagerApproved
            };

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            // Act
            var act = () => _sut.ManagerRejectAsync(
                Guid.NewGuid(),
                requestId,
                new ApprovalDecisionDto());

            // Assert
            await act.Should()
                .ThrowAsync<BadRequestException>();

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Never);

            _cacheServiceMock.Verify(
                x => x.RemoveAsync(It.IsAny<string>()),
                Times.Never);
        }

        #endregion

        #region HRApproveAsync

        [Fact]
        public async Task HRApproveAsync_ShouldApproveRequestAndDeductBalance()
        {
            // Arrange
            var hrId = Guid.NewGuid();
            var requestId = Guid.NewGuid();
            var employeeId = Guid.NewGuid();
            var leaveTypeId = Guid.NewGuid();

            var approval = new Approval();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                EmployeeId = employeeId,
                LeaveTypeId = leaveTypeId,
                Status = RequestStatus.ManagerApproved,
                StartDate = new DateOnly(2026, 9, 10),
                EndDate = new DateOnly(2026, 9, 14),
                Approval = approval
            };
            leaveRequest.CalculateTotalDays();

            var balance = new EmployeeLeaveBalance
            {
                EmployeeId = employeeId,
                LeaveTypeId = leaveTypeId,
                RemainingDays = 20
            };

            var leaveRequestRepositoryMock = new Mock<IGenericRepository<LeaveRequest>>();
            var balanceRepositoryMock = new Mock<IGenericRepository<EmployeeLeaveBalance>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(leaveRequestRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(x => x.Repository<EmployeeLeaveBalance>())
                .Returns(balanceRepositoryMock.Object);

            leaveRequestRepositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            balanceRepositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(balance);

            // Act
            await _sut.HRApproveAsync(
                hrId,
                requestId,
                new ApprovalDecisionDto
                {
                    Comment = "Approved by HR"
                });

            // Assert
            leaveRequest.Status.Should().Be(RequestStatus.HRApproved);

            approval.HRId.Should().Be(hrId);
            approval.HRDecision.Should().Be(Decision.Approved);
            approval.HRComment.Should().Be("Approved by HR");
            approval.HRDecisionDate.Should().NotBe(default);

            balance.RemainingDays.Should().Be(15);

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Once);

            _cacheServiceMock.Verify(
                x => x.RemoveAsync(CacheKeys.HRDashboard),
                Times.Once);
        }

        [Fact]
        public async Task HRApproveAsync_ShouldThrowBadRequest_WhenRequestIsNotManagerApproved()
        {
            // Arrange
            var requestId = Guid.NewGuid();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                Status = RequestStatus.Pending
            };

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            // Act
            var act = () => _sut.HRApproveAsync(
                Guid.NewGuid(),
                requestId,
                new ApprovalDecisionDto());

            // Assert
            await act.Should()
                .ThrowAsync<BadRequestException>();

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task HRApproveAsync_ShouldThrowBadRequest_WhenBalanceDoesNotExist()
        {
            // Arrange
            var requestId = Guid.NewGuid();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                EmployeeId = Guid.NewGuid(),
                LeaveTypeId = Guid.NewGuid(),
                Status = RequestStatus.ManagerApproved,
                StartDate = new DateOnly(2026, 9, 10),
                EndDate = new DateOnly(2026, 9, 14),
                Approval = new Approval()
            };

            var leaveRequestRepositoryMock = new Mock<IGenericRepository<LeaveRequest>>();
            var balanceRepositoryMock = new Mock<IGenericRepository<EmployeeLeaveBalance>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(leaveRequestRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(x => x.Repository<EmployeeLeaveBalance>())
                .Returns(balanceRepositoryMock.Object);

            leaveRequestRepositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            balanceRepositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync((EmployeeLeaveBalance?)null);

            // Act
            var act = () => _sut.HRApproveAsync(
                Guid.NewGuid(),
                requestId,
                new ApprovalDecisionDto());

            // Assert
            await act.Should()
                .ThrowAsync<BadRequestException>();

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Never);

            _cacheServiceMock.Verify(
                x => x.RemoveAsync(It.IsAny<string>()),
                Times.Never);
        }

        [Fact]
        public async Task HRApproveAsync_ShouldCreateApproval_WhenApprovalDoesNotExist()
        {
            // Arrange
            var hrId = Guid.NewGuid();
            var requestId = Guid.NewGuid();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                EmployeeId = Guid.NewGuid(),
                LeaveTypeId = Guid.NewGuid(),
                Status = RequestStatus.ManagerApproved,
                StartDate = new DateOnly(2026, 9, 10),
                EndDate = new DateOnly(2026, 9, 12),
                Approval = null
            };
            leaveRequest.CalculateTotalDays();

            var balance = new EmployeeLeaveBalance
            {
                RemainingDays = 10
            };

            var leaveRequestRepositoryMock = new Mock<IGenericRepository<LeaveRequest>>();
            var balanceRepositoryMock = new Mock<IGenericRepository<EmployeeLeaveBalance>>();
            var approvalRepositoryMock = new Mock<IGenericRepository<Approval>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(leaveRequestRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(x => x.Repository<EmployeeLeaveBalance>())
                .Returns(balanceRepositoryMock.Object);

            _unitOfWorkMock
                .Setup(x => x.Repository<Approval>())
                .Returns(approvalRepositoryMock.Object);

            leaveRequestRepositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            balanceRepositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<EmployeeLeaveBalance>>()))
                .ReturnsAsync(balance);

            // Act
            await _sut.HRApproveAsync(
                hrId,
                requestId,
                new ApprovalDecisionDto());

            // Assert
            leaveRequest.Approval.Should().NotBeNull();

            approvalRepositoryMock.Verify(
                x => x.AddAsync(It.Is<Approval>(a =>
                    a.LeaveRequestId == requestId)),
                Times.Once);

            balance.RemainingDays.Should().Be(7);
            leaveRequest.Status.Should().Be(RequestStatus.HRApproved);
        }

        #endregion

        #region HRRejectAsync

        [Fact]
        public async Task HRRejectAsync_ShouldRejectManagerApprovedRequest()
        {
            // Arrange
            var hrId = Guid.NewGuid();
            var requestId = Guid.NewGuid();

            var approval = new Approval();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                Status = RequestStatus.ManagerApproved,
                Approval = approval
            };

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            // Act
            await _sut.HRRejectAsync(
                hrId,
                requestId,
                new ApprovalDecisionDto
                {
                    Comment = "Rejected by HR"
                });

            // Assert
            leaveRequest.Status.Should().Be(RequestStatus.RejectedByHR);

            approval.HRId.Should().Be(hrId);
            approval.HRDecision.Should().Be(Decision.Rejected);
            approval.HRComment.Should().Be("Rejected by HR");
            approval.HRDecisionDate.Should().NotBe(default);

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Once);

            _cacheServiceMock.Verify(
                x => x.RemoveAsync(CacheKeys.HRDashboard),
                Times.Once);
        }

        [Fact]
        public async Task HRRejectAsync_ShouldThrowNotFound_WhenRequestDoesNotExist()
        {
            // Arrange
            var requestId = Guid.NewGuid();

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync((LeaveRequest?)null);

            // Act
            var act = () => _sut.HRRejectAsync(
                Guid.NewGuid(),
                requestId,
                new ApprovalDecisionDto());

            // Assert
            await act.Should()
                .ThrowAsync<NotFoundException>();

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Never);
        }

        [Fact]
        public async Task HRRejectAsync_ShouldThrowBadRequest_WhenRequestIsNotManagerApproved()
        {
            // Arrange
            var requestId = Guid.NewGuid();

            var leaveRequest = new LeaveRequest
            {
                Id = requestId,
                Status = RequestStatus.Pending
            };

            var repositoryMock = new Mock<IGenericRepository<LeaveRequest>>();

            _unitOfWorkMock
                .Setup(x => x.Repository<LeaveRequest>())
                .Returns(repositoryMock.Object);

            repositoryMock
                .Setup(x => x.FirstOrDefaultAsync(It.IsAny<ISpecification<LeaveRequest>>()))
                .ReturnsAsync(leaveRequest);

            // Act
            var act = () => _sut.HRRejectAsync(
                Guid.NewGuid(),
                requestId,
                new ApprovalDecisionDto());

            // Assert
            await act.Should()
                .ThrowAsync<BadRequestException>();

            _unitOfWorkMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Never);

            _cacheServiceMock.Verify(
                x => x.RemoveAsync(It.IsAny<string>()),
                Times.Never);
        }

        #endregion
    }
}
