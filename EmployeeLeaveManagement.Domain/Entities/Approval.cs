using EmployeeLeaveManagement.Domain.Common;
using EmployeeLeaveManagement.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Domain.Entities
{
    public class Approval : BaseEntity<Guid>
    {
        public Guid LeaveRequestId { get; set; }
        public Guid? ManagerId { get; set; }
        public Decision ManagerDecision { get; set; }
        public string? ManagerComment { get; set; }
        public DateTime? ManagerDecisionDate { get; set; }
        public Guid? HRId { get; set; }
        public Decision HRDecision { get; set; }
        public string? HRComment { get; set; }
        public DateTime? HRDecisionDate { get; set; }

        //Navigation
        public LeaveRequest? LeaveRequest { get; set; }
        public Employee? Manager { get; set; }
        public Employee? HR { get; set; }

    }
}
