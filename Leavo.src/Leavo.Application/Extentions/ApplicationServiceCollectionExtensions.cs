using EmployeeLeaveManagement.Application.Mappings;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Extentions
{
    public static class ApplicationServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(ApplicationAssemblyReference).Assembly);
            services.AddValidatorsFromAssembly(typeof(ApplicationAssemblyReference).Assembly);
            return services;
        }
    }
}
