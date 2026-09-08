using Leavo.Application.Abstractions.Caching;
using Leavo.Application.Abstractions.Persistence;
using Leavo.Application.Abstractions.Services;
using Leavo.Domain.Entities;
using Leavo.Infrastructure.Authentication;
using Leavo.Infrastructure.Persistence.Caching;
using Leavo.Infrastructure.Persistence.Context;
using Leavo.Infrastructure.Persistence.Repositories;
using Leavo.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Extensions
{
    public static class InfrastructureServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration _configuration)
        {
            //Register DbContext
            services.AddDbContext<LeavoDbContext>(options =>
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
                .AddEntityFrameworkStores<LeavoDbContext>();

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

            // Register Redis
            services.AddSingleton<IConnectionMultiplexer>(
                ConnectionMultiplexer.Connect(
                    _configuration.GetConnectionString("Redis")!));

            //Register Services
            services.AddSingleton<ICacheService, RedisCacheService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IEmployeeManagementService, EmployeeManagementService>();
            services.AddScoped<ILeaveRequestService, LeaveRequestService>();
            services.AddScoped<IApprovalService, ApprovalService>();
            services.AddScoped<IHolidayService, HolidayService>();
            services.AddScoped<ILeaveTypeService, LeaveTypeService>();
            services.AddScoped<IBalanceService, BalanceService>();
            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IOrganizationManagementService, OrganizationManagementService>();


            return services;
        }
    }
}
