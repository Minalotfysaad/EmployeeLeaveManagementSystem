using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using Leavo.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Persistence.Specifications
{
    public sealed class ManagerLeaveRequestsByStatusSpecification
        : BaseSpecification<LeaveRequest>
    {
        public ManagerLeaveRequestsByStatusSpecification(
            Guid managerId,
            RequestStatus status)
            : base(r =>
                r.Employee!.ManagerId == managerId &&
                r.Status == status)
        {
        }
    }
}
