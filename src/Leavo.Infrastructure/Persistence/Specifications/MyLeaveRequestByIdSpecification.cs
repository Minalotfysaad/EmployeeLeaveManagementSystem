using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Persistence.Specifications
{
    public sealed class MyLeaveRequestByIdSpecification
        : BaseSpecification<LeaveRequest>
    {
        public MyLeaveRequestByIdSpecification(Guid employeeId, Guid requestId)
            : base(r =>
                r.Id == requestId &&
                r.EmployeeId == employeeId)
        {
            AddInclude(r => r.LeaveType);
        }
    }
}
