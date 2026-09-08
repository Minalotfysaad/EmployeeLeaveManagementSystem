using EmployeeLeaveManagement.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Domain.Entities
{
    public class Department : BaseEntity<Guid>
    {
        public string Name { get; set; } = default!;
        public Guid? ManagerId { get; set; }

        // Navigation
        public Employee? Manager { get; set; }
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}
