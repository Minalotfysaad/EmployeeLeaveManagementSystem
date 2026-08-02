using EmployeeLeaveManagement.API.ExceptionHandlers;

namespace EmployeeLeaveManagement.API.Extensions
{
    public static class APIServiceCollectionExtensions
    {
        public static IServiceCollection AddAPIServices(this IServiceCollection services)
        {
            services.AddProblemDetails();

            services.AddExceptionHandler<GlobalExceptionHandler>();

            return services;
        }
    }
}
