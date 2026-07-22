using EmployeeLeaveManagement.Domain.Common;
using EmployeeLeaveManagement.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Domain.Entities
{
    public class LeaveRequest : BaseEntity<Guid>
    {
        public Guid EmployeeId { get; set; }
        public Guid LeaveTypeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TotalDays { get; set; }
        public string? Reason { get; set; }
        public RequestStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        //Navigation
        public Employee? Employee { get; set; }
        public LeaveType? LeaveType { get; set; }
        public Approval? Approval { get; set; }
    }
}
