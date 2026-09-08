using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Persistence.Specifications
{
    public sealed class EmployeeLeaveBalanceByLeaveTypeSpecification : BaseSpecification<EmployeeLeaveBalance>
    {
        public EmployeeLeaveBalanceByLeaveTypeSpecification(Guid leaveTypeId)
            : base(b => b.LeaveTypeId == leaveTypeId)
        {
        }
    }
}
