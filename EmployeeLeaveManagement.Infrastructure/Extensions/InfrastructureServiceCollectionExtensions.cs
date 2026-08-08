using EmployeeLeaveManagement.Application.Abstractions.Services;
using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Infrastructure.Authentication;
using EmployeeLeaveManagement.Infrastructure.Persistence.Context;
using EmployeeLeaveManagement.Infrastructure.Services;
using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Extensions
{
    public static class InfrastructureServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration _configuration)
        {
            //Register DbContext
            services.AddDbContext<EmployeeLeaveManagementDbContext>(options =>
            {
                options.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
            });

            //Register Identity
            services.AddIdentityCore<Employee>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 8;
            })
                .AddRoles<IdentityRole<Guid>>()
                .AddSignInManager<SignInManager<Employee>>()
                .AddEntityFrameworkStores<EmployeeLeaveManagementDbContext>();

            //Configurations
            services.Configure<JwtSettings>(_configuration.GetSection("JwtSettings"));
            services.Configure<DefaultAdminSettings>(_configuration.GetSection("DefaultAdmin"));
            services.ConfigureOptions<JwtBearerOptionsSetup>();


            //Register JWT Authentication
            services.AddAuthentication(options =>
            {
                //"When a request comes in, which authentication handler should I use to identify the user?"
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                //"If authentication fails, how should I challenge the client? (returning a 401 challenge)"
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer();

            //Register Services
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IEmployeeManagementService, EmployeeManagementService>();
            services.AddScoped<ILeaveRequestService, LeaveRequestService>();
            services.AddScoped<IApprovalService, ApprovalService>();
            services.AddScoped<IHolidayService, HolidayService>();
            services.AddScoped<ILeaveTypeService, LeaveTypeService>();


            return services;
        }
    }
}
