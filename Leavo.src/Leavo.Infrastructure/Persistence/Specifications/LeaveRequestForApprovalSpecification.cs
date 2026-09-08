using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Persistence.Specifications
{
    public sealed class LeaveRequestForApprovalSpecification : BaseSpecification<LeaveRequest>
    {
        public LeaveRequestForApprovalSpecification(Guid requestId) : base(r => r.Id == requestId)
        {
            AddInclude(r => r.Employee);
            AddInclude(r => r.LeaveType);
            AddInclude(r => r.Approval);
        }
    }
}
