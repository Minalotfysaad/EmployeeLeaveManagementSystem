using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.DTOs.Employee
{
    public class UpdateEmployeeDto
    {
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
    }
}
