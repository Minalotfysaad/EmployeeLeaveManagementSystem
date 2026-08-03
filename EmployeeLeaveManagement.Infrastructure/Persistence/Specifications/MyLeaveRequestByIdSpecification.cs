using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
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
