using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Domain.Enums
{
    public enum RequestStatus
    {
        Pending = 0,
        Cancelled = 1,
        RejectedByManager = 2,
        ManagerApproved = 3,
        RejectedByHR = 4,
        HRApproved = 5
    }
}
