using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EmployeeLeaveManagement.Domain.Enums;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
{
    public sealed class HRDashboardPendingHRRequestsSpecification
        : BaseSpecification<LeaveRequest>
    {
        public HRDashboardPendingHRRequestsSpecification()
            : base(r => r.Status == RequestStatus.ManagerApproved)
        {
        }
    }
}
