using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Application.DTOs.RoleManagement;
using EmployeeLeaveManagement.Application.Exceptions;
using EmployeeLeaveManagement.Domain.Constants;
using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Infrastructure.Persistence.Specifications;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Services
{
    public class OrganizationManagementService(
        IUnitOfWork _unitOfWork,
        ILogger<OrganizationManagementService> _logger,
        UserManager<Employee> _userManager)
        : IOrganizationManagementService
    {
        public async Task UpdateEmployeeRoleAsync(Guid employeeId, UpdateEmployeeRoleDto dto)
        {
            var employee = await _userManager.FindByIdAsync(employeeId.ToString());

            if(employee == null)
            {
                throw new NotFoundException(nameof(Employee), employeeId);
            }

            var role = dto.Role.Trim();
            var allowedRoles = new[]
            {
                Roles.Employee,
                Roles.Manager,
                Roles.HR
            };

            if (!allowedRoles.Contains(role,StringComparer.OrdinalIgnoreCase))
                throw new BadRequestException("Invalid role.");

            // Normalize to the application's role name
            role = allowedRoles
                .First(r =>string.Equals(
                    r,
                    role,
                    StringComparison.OrdinalIgnoreCase));

            // Prevent removing the last HR
            if (await _userManager.IsInRoleAsync(employee, Roles.HR) &&
                !string.Equals(
                    role,
                    Roles.HR,
                    StringComparison.Ordinal))
            {
                var hrUsers = await _userManager.GetUsersInRoleAsync(Roles.HR);

                if (hrUsers.Count <= 1)
                    throw new BadRequestException("Cannot remove last HR user.");
            }

            var currentRoles = await _userManager.GetRolesAsync(employee);
            if (currentRoles.Contains(role))
                return;

            var removeResult =await _userManager.RemoveFromRolesAsync(employee, currentRoles);

            if (!removeResult.Succeeded)
                throw new BadRequestException( removeResult.Errors
                        .Select(e => e.Description)
                        .ToList());


            var addResult = await _userManager.AddToRoleAsync(employee, role);

            if (!addResult.Succeeded)
                throw new BadRequestException(addResult.Errors
                        .Select(e => e.Description)
                        .ToList());

            _logger.LogInformation("Role assigned to employee. EmployeeId: {EmployeeId}, Role: {Role}",
                employeeId,
                role);
        }

        public async Task AssignManagerAsync(Guid employeeId, Guid managerId)
        {
            if (employeeId == managerId)
                throw new BadRequestException("An employee cannot be their own manager.");

            var employeeRepository = _unitOfWork.Repository<Employee>();

            var employee = await employeeRepository.FirstOrDefaultAsync(
                new EmployeeByIdSpecification(employeeId))
                ?? throw new NotFoundException(nameof(Employee), employeeId);

            var manager = await employeeRepository.FirstOrDefaultAsync(
                new EmployeeByIdSpecification(managerId))
                ?? throw new NotFoundException(nameof(Employee), managerId);

            var isManager = await _userManager.IsInRoleAsync(manager,Roles.Manager);

            if (!isManager)
                throw new BadRequestException("The selected employee is not a Manager.");

            employee.ManagerId = managerId;

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Manager assigned to employee. ManagerId: {ManagerId}, EmployeeId: {EmployeeId}",
                managerId,
                employeeId);
        }

        public async Task AssignDepartmentAsync(Guid employeeId, Guid departmentId)
        {
            var employeeRepository = _unitOfWork.Repository<Employee>();

            var employee = await employeeRepository.FirstOrDefaultAsync(
                new EmployeeByIdSpecification(employeeId))
                ?? throw new NotFoundException(nameof(Employee), employeeId);

            var departmentRepository = _unitOfWork.Repository<Department>();

            var department = await departmentRepository.FirstOrDefaultAsync(
                new DepartmentByIdSpecification(departmentId))
                ?? throw new NotFoundException(nameof(Department), departmentId);

            employee.DepartmentId = departmentId;

            await _unitOfWork.SaveChangesAsync();
        }


    }
}
