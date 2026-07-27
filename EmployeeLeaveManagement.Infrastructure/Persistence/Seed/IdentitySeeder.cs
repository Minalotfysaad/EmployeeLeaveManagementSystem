using EmployeeLeaveManagement.Domain.Constants;
using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Infrastructure.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Seed
{
    public static class IdentitySeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();

            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<Employee>>();

            // Ensure roles exist
            string[] roles =
            {
                Roles.Employee,
                Roles.Manager,
                Roles.HR
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    var result = await roleManager.CreateAsync(
                        new IdentityRole<Guid>
                        {
                            Name = role
                        });

                    if (!result.Succeeded)
                    {
                        throw new InvalidOperationException(
                            $"Failed to create role '{role}'. " +
                            string.Join(", ", result.Errors.Select(e => e.Description)));
                    }
                }
            }

            // Ensure default HR account exists
            var adminSettings = scope.ServiceProvider.GetRequiredService<IOptions<DefaultAdminSettings>>().Value;

            //Check DefaultAdmin configuration exists
            CheckDefaultAdminConfigExist(adminSettings);

            var defaultAdmin = await userManager.FindByEmailAsync(adminSettings.Email);

            if (defaultAdmin is null)
            {
                defaultAdmin = new Employee
                {
                    UserName = adminSettings.Email,
                    Email = adminSettings.Email,
                    FirstName = adminSettings.FirstName,
                    LastName = adminSettings.LastName
                };

                var createResult = await userManager.CreateAsync(defaultAdmin, adminSettings.Password);

                if (!createResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        $"Failed to create default HR user. " +
                        string.Join(", ", createResult.Errors.Select(e => e.Description)));
                }
            }

            // Ensure the user has the HR role
            if (!await userManager.IsInRoleAsync(defaultAdmin, Roles.HR))
            {
                var roleResult = await userManager.AddToRoleAsync(defaultAdmin, Roles.HR);

                if (!roleResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        $"Failed to assign HR role. " +
                        string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                }
            }
        }

        #region Helpers
        private static void CheckDefaultAdminConfigExist(DefaultAdminSettings adminSettings)
        {
            if (string.IsNullOrWhiteSpace(adminSettings.Email))
                throw new InvalidOperationException("DefaultAdmin:Email is missing.");

            if (string.IsNullOrWhiteSpace(adminSettings.Password))
                throw new InvalidOperationException("DefaultAdmin:Password is missing.");

            if (string.IsNullOrWhiteSpace(adminSettings.FirstName))
                throw new InvalidOperationException("DefaultAdmin:FirstName is missing.");

            if (string.IsNullOrWhiteSpace(adminSettings.LastName))
                throw new InvalidOperationException("DefaultAdmin:LastName is missing.");
        } 
        #endregion
    }
}
