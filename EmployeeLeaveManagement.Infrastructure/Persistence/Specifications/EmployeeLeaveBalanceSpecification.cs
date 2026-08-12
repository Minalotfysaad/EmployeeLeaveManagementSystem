using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
{
    public sealed class EmployeeLeaveBalanceSpecification: BaseSpecification<EmployeeLeaveBalance>
    {
        public EmployeeLeaveBalanceSpecification(Guid employeeId,Guid leaveTypeId)
            : base(lb => lb.EmployeeId == employeeId &&
                         lb.LeaveTypeId == leaveTypeId)
        {
            AddInclude(b => b.LeaveType);
            ApplyNoTracking();
        }

        public EmployeeLeaveBalanceSpecification(Guid employeeId)
            : base(lb => lb.EmployeeId == employeeId)
        {
            AddInclude(b => b.LeaveType);
            ApplyNoTracking();
            ApplyOrderBy(b => b.LeaveType!.Name);
        }
    }
}
