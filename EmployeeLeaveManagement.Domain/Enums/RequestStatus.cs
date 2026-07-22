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

        ManagerApproved,

        ManagerRejected,

        HRApproved,

        HRRejected,

        Cancelled
    }
}
