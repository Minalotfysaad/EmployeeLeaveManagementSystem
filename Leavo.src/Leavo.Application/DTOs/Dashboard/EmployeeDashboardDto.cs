using Leavo.Application.DTOs.Balance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.DTOs.Dashboard
{
    public sealed class EmployeeDashboardDto
    {
        public List<BalanceDto> LeaveBalances { get; set; } = [];
        public int PendingRequests { get; set; }
        public int ApprovedRequests { get; set; }
        public int RejectedRequests { get; set; }
        public int UpcomingLeaveRequests { get; set; }
    }
}
