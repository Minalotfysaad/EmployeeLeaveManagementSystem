using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
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
