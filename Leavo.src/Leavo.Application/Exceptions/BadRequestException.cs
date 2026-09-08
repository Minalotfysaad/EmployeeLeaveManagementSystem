using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Exceptions
{
    public sealed class BadRequestException : Exception
    {
        public IReadOnlyList<string> Errors { get; }

        //Ctors
        public BadRequestException(List<string> errors): base("Validation Failed")
        {
            Errors = errors;
        }

        public BadRequestException(string error): base(error)
        {
            Errors = new[] { error };
        }
    }
}
