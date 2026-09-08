using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeLeaveManagement.API.Controllers
{
    public abstract class ApiControllerBase : ControllerBase
    {
        protected Guid CurrentUserId
        {
            get
            {
                var employeeIdClaim =User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (!Guid.TryParse(employeeIdClaim, out var employeeId))
                    throw new UnauthorizedAccessException("Invalid user identity.");

                return employeeId;
            }
        }
    }
}
