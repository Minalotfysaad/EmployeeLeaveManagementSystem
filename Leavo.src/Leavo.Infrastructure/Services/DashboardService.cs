using AutoMapper;
using EmployeeLeaveManagement.Application.Abstractions.Caching;
using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.Common.Models.Caching;
using EmployeeLeaveManagement.Application.DTOs.Balance;
using EmployeeLeaveManagement.Application.DTOs.Dashboard;
using EmployeeLeaveManagement.Application.Exceptions;
using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Domain.Enums;
using EmployeeLeaveManagement.Infrastructure.Persistence.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public class DashboardService(
        IUnitOfWork _unitOfWork,
        ICacheService _cacheService,
        IMapper _mapper)
        : IDashboardService 
    {
        public async Task<EmployeeDashboardDto> GetEmployeeDashboardAsync(Guid employeeId)
        {
            //Check Employee Exists
            var employeeRepository = _unitOfWork.Repository<Employee>();
            var employeeExists = await employeeRepository.AnyAsync(
                new EmployeeByIdSpecification(employeeId));

            if (!employeeExists)
                throw new NotFoundException(nameof(Employee), employeeId);

            //Leave Balances
            var balancesRepository = _unitOfWork.Repository<EmployeeLeaveBalance>();
            var balances = await balancesRepository.ListAsync(new EmployeeLeaveBalanceSpecification(employeeId));

            //Leave Requests
            var leaveRequestsRepository = _unitOfWork.Repository<LeaveRequest>();
            int pendingCount = await leaveRequestsRepository.CountAsync(
                    new EmployeeLeaveRequestsByStatusSpecification(employeeId, RequestStatus.Pending));
            int approvedCount = await leaveRequestsRepository.CountAsync(
                    new EmployeeLeaveRequestsByStatusSpecification(employeeId, RequestStatus.HRApproved));
            int rejectedCount = await leaveRequestsRepository.CountAsync(
                        new EmployeeLeaveRequestsByStatusSpecification(employeeId, RequestStatus.RejectedByHR));
            int upcomingCount = await leaveRequestsRepository.CountAsync(
                new EmployeeUpcomingLeaveSpecification(employeeId));

            return new EmployeeDashboardDto
            {
                LeaveBalances = _mapper.Map<List<BalanceDto>>(balances),
                PendingRequests = pendingCount,
                ApprovedRequests = approvedCount,
                RejectedRequests = rejectedCount,
                UpcomingLeaveRequests = upcomingCount
            };
        }

        public async Task<ManagerDashboardDto> GetManagerDashboardAsync(Guid managerId)
        {
            // Verify manager exists
            var employeeRepository = _unitOfWork.Repository<Employee>();

            var managerExists = await employeeRepository.AnyAsync(
                new EmployeeByIdSpecification(managerId));

            if (!managerExists)
                throw new NotFoundException(nameof(Employee), managerId);

            var leaveRequestRepository = _unitOfWork.Repository<LeaveRequest>();

            // Team size
            int teamSize = await employeeRepository.CountAsync(
                new ManagerTeamSpecification(managerId));

            // Leave requests
            var pendingRequests = await leaveRequestRepository.CountAsync(
                new ManagerLeaveRequestsByStatusSpecification(managerId, RequestStatus.Pending));

            var approvedRequests = await leaveRequestRepository.CountAsync(
                new ManagerLeaveRequestsByStatusSpecification(managerId, RequestStatus.HRApproved));

            var rejectedRequests = await leaveRequestRepository.CountAsync(
                new ManagerLeaveRequestsByStatusSpecification(managerId, RequestStatus.RejectedByHR));

            // Employees currently on leave
            var employeesCurrentlyOnLeave = await employeeRepository.CountAsync(
            new ManagerEmployeesCurrentlyOnLeaveSpecification(managerId));

            return new ManagerDashboardDto
            {
                TeamSize = teamSize,
                PendingRequests = pendingRequests,
                ApprovedRequests = approvedRequests,
                RejectedRequests = rejectedRequests,
                EmployeesCurrentlyOnLeave = employeesCurrentlyOnLeave
            };

        }

        public async Task<HRDashboardDto> GetHRDashboardAsync() 
        {
            //Check if cached
            var cachedDashboard = await _cacheService.GetAsync<HRDashboardDto>(CacheKeys.HRDashboard);

            if (cachedDashboard is not null)
                return cachedDashboard;


            var employeeRepository = _unitOfWork.Repository<Employee>();
            var departmentRepository = _unitOfWork.Repository<Department>();
            var leaveRequestRepository = _unitOfWork.Repository<LeaveRequest>();
            var holidayRepository = _unitOfWork.Repository<Holiday>();


            var totalEmployees = await employeeRepository.CountAsync(new AllEmployeesSpecification());
            var totalDepartments = await departmentRepository.CountAsync(new AllDepartmentsSpecification());
            var pendingManagerApprovals = await leaveRequestRepository.CountAsync(new HRDashboardPendingManagerRequestsSpecification());
            var pendingHRApprovals = await leaveRequestRepository.CountAsync(new HRDashboardPendingHRRequestsSpecification());
            var employeesCurrentlyOnLeave = await employeeRepository.CountAsync(new EmployeesCurrentlyOnLeaveSpecification());
            var upcomingHolidays = await holidayRepository.CountAsync(new UpcomingHolidaysSpecification());


            // Leave requests created this month
            var now = DateTime.UtcNow;

            var startOfMonth = new DateTime(
                now.Year,
                now.Month,
                1,
                0,
                0,
                0,
                DateTimeKind.Utc);

            var startOfNextMonth = startOfMonth.AddMonths(1);

            var leaveRequestsThisMonth = await leaveRequestRepository.CountAsync(
                new LeaveRequestsThisMonthSpecification( startOfMonth, startOfNextMonth));

            //Build dashboard
            var dashboard = new HRDashboardDto
            {
                TotalEmployees = totalEmployees,
                TotalDepartments = totalDepartments,
                PendingManagerApprovals = pendingManagerApprovals,
                PendingHRApprovals = pendingHRApprovals,
                EmployeesCurrentlyOnLeave = employeesCurrentlyOnLeave,
                UpcomingHolidays = upcomingHolidays,
                LeaveRequestsThisMonth = leaveRequestsThisMonth
            };

            //Cache dashboard
            await _cacheService.SetAsync(CacheKeys.HRDashboard, dashboard, TimeSpan.FromMinutes(5));

            return dashboard;
        }   

    }
}
