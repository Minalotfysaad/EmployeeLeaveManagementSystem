using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Persistence.Specifications
{
    public sealed class LeaveRequestsThisMonthSpecification
        : BaseSpecification<LeaveRequest>
    {
        public LeaveRequestsThisMonthSpecification(
            DateTime startOfMonth,
            DateTime startOfNextMonth)
            : base(r =>
                r.CreatedAt >= startOfMonth &&
                r.CreatedAt < startOfNextMonth)
        {
        }
    }
}
