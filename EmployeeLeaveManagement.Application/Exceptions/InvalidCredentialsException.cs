using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Exceptions
{
    public sealed class InvalidCredentialsException() : Exception("Invalid credentials")
    {
    }
}
