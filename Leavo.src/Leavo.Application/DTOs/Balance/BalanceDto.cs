using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.DTOs.Balance
{
    public sealed class BalanceDto
    {
        public Guid LeaveTypeId { get; set; }
        public string LeaveType { get; set; } = default!;
        public int RemainingDays { get; set; }
    }
}

