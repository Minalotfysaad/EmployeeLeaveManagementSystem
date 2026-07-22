using EmployeeLeaveManagement.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Domain.Entities
{
    public class EmployeeLeaveBalance : BaseEntity<Guid>
    {
        public Guid EmployeeId { get; set; }
        public Guid LeaveTypeId { get; set; }
        public int RemainingDays { get; set; }

        //Navigation
        public LeaveType? LeaveType { get; set; }
        public Employee? Employee { get; set; }

    }
}
