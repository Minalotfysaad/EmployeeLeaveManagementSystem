using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Seed
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(EmployeeLeaveManagementDbContext context)
        {
            await SeedDepartmentsAsync(context);
            await SeedLeaveTypesAsync(context);
            await SeedHolidaysAsync(context);
        }

        private static async Task SeedDepartmentsAsync(EmployeeLeaveManagementDbContext context)
        {
            if (await context.Departments.AnyAsync())
                return;

            List<Department> departments =
            [
                new Department
            {
                Name = "Human Resources"
            },

            new Department
            {
                Name = "Information Technology"
            },

            new Department
            {
                Name = "Finance"
            },

            new Department
            {
                Name = "Operations"
            },

            new Department
            {
                Name = "Marketing"
            }
            ];

            await context.Departments.AddRangeAsync(departments);
            await context.SaveChangesAsync();
        }

        private static async Task SeedLeaveTypesAsync(EmployeeLeaveManagementDbContext context)
        {
            if (await context.LeaveTypes.AnyAsync())
                return;

            List<LeaveType> leaveTypes =
            [
                new LeaveType
            {
                Name = "Annual Leave",
                DefaultDays = 21
            },

            new LeaveType
            {
                Name = "Sick Leave",
                DefaultDays = 10
            },

            new LeaveType
            {
                Name = "Emergency Leave",
                DefaultDays = 5
            }
            ];

            await context.LeaveTypes.AddRangeAsync(leaveTypes);
            await context.SaveChangesAsync();
        }

        private static async Task SeedHolidaysAsync(EmployeeLeaveManagementDbContext context)
        {
            if (await context.Holidays.AnyAsync())
                return;

            var currentYear = DateTime.UtcNow.Year;
            var defaultUserId = await context.Users.Select(u => u.Id).FirstOrDefaultAsync();

            List<Holiday> holidays =
            [
                new Holiday
            {
                Name = "New Year's Day",
                StartDate = new DateTime(currentYear, 1, 1),
                EndDate = new DateTime(currentYear, 1, 1),
                CreatedBy = defaultUserId
            },

            new Holiday
            {
                Name = "Labour Day",
                StartDate = new DateTime(currentYear, 5, 1),
                EndDate = new DateTime(currentYear, 5, 1),
                CreatedBy = defaultUserId
            },

            new Holiday
            {
                Name = "Christmas Day",
                StartDate = new DateTime(currentYear, 12, 25),
                EndDate = new DateTime(currentYear, 12, 25),
                CreatedBy = defaultUserId
            }
            ];

            await context.Holidays.AddRangeAsync(holidays);
            await context.SaveChangesAsync();
        }
    }
}
