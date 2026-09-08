using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Leavo.Domain.Enums;

namespace Leavo.Infrastructure.Persistence.Specifications
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
