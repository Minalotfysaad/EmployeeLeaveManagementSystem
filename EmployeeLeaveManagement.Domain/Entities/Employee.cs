using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace EmployeeLeaveManagement.Domain.Entities
{
    public class Employee : IdentityUser<Guid>
    {
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public Guid DepartmentId { get; set; }
        public Guid? ManagerId { get; set; }
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

        // Navigation
        public Department? Department { get; set; }
        public Employee? Manager { get; set; } // For Employee user
        public ICollection<Employee> Subordinates { get; set; } = new List<Employee>(); // For Manager User
        public ICollection<EmployeeLeaveBalance> EmployeeLeaveBalances { get; set; } = new List<EmployeeLeaveBalance>();
        public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
    }
}
