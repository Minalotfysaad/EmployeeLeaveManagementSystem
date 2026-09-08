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
    public sealed class HRDashboardPendingManagerRequestsSpecification
        : BaseSpecification<LeaveRequest>
    {
        public HRDashboardPendingManagerRequestsSpecification()
            : base(r => r.Status == RequestStatus.Pending)
        {
        }
    }
}
