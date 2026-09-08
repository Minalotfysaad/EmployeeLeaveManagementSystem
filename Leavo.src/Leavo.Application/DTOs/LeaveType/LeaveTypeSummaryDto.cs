using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.DTOs.LeaveType
{
    public class LeaveTypeSummaryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public int DefaultDays { get; set; }
    }
}