using EmployeeLeaveManagement.Application.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeLeaveManagement.API.ExceptionHandlers
{
    public sealed class GlobalExceptionHandler : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            ProblemDetails problemDetails = exception switch
            {
                NotFoundException ex => new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "Resource Not Found",
                    Detail = ex.Message
                },

                InvalidCredentialsException ex => new ProblemDetails
                {
                    Status = StatusCodes.Status401Unauthorized,
                    Title = "Authentication Failed",
                    Detail = ex.Message
                },

                BadRequestException ex => CreateValidationProblemDetails(ex),

                _ => new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Internal Server Error",
                    Detail = "An unexpected error occurred."
                }
            };

            httpContext.Response.StatusCode = problemDetails.Status!.Value;

            await httpContext.Response.WriteAsJsonAsync(
                problemDetails,
                cancellationToken);

            return true;
        }



        #region Helpers
        private static ValidationProblemDetails CreateValidationProblemDetails(BadRequestException exception)
        {
            var errors = exception.Errors
                .Select((message, index) => new { index, message })
                .ToDictionary(
                    x => $"Error{x.index + 1}",
                    x => new[] { x.message });

            return new ValidationProblemDetails(errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation Failed",
                Detail = "One or more validation errors occurred."
            };
        } 
        #endregion
    }
}
