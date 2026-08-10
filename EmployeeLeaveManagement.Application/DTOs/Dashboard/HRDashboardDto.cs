using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.DTOs.Dashboard
{
    public sealed class HRDashboardDto
    {
        public int TotalEmployees { get; set; }
        public int TotalDepartments { get; set; }
        public int PendingManagerApprovals { get; set; }
        public int PendingHRApprovals { get; set; }
        public int EmployeesCurrentlyOnLeave { get; set; }
        public int UpcomingHolidays { get; set; }
        public int LeaveRequestsThisMonth { get; set; }
    }
}
