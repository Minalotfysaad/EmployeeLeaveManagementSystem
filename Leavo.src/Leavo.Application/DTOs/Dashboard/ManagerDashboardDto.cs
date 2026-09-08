using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.DTOs.Dashboard
{
    public sealed class ManagerDashboardDto
    {
        public int TeamSize { get; set; }
        public int PendingRequests { get; set; }
        public int ApprovedRequests { get; set; }
        public int RejectedRequests { get; set; }
        public int EmployeesCurrentlyOnLeave { get; set; }
    }
}
