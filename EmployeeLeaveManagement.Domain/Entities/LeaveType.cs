using EmployeeLeaveManagement.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Domain.Entities
{
    public class LeaveType : BaseEntity<Guid>
    {
        public string Name { get; set; } = default!;
        public string? Description { get; set; } = default!;
        public int DefaultDays { get; set; }

    }
}
