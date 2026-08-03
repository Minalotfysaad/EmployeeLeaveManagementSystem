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
        Approved = 1,
        RejectedByManager = 2,
        RejectedByHR = 3,
        Cancelled = 4
    }
}
