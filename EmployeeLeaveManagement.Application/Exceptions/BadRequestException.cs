using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Exceptions
{
    public sealed class BadRequestException(List<string> errors) : Exception("Validation Failed")
    {
        public IReadOnlyList<string> Errors { get; } = errors;
    }
}
