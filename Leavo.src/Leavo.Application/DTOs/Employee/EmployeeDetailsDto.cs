using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.DTOs.Employee
{
    public class EmployeeDetailsDto
    {
        public Guid Id { get; set; } = default!;
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string DepartmentName { get; set; } = default!;
        public string? PhoneNumber { get; set; } = default!;
        public List<string> Roles { get; set; } = [];
        public DateTime CreatedDate { get; set; }

    }
}
