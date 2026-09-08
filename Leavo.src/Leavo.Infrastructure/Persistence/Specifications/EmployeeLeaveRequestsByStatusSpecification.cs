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
    public class EmployeeLeaveRequestsByStatusSpecification : BaseSpecification<LeaveRequest>
    {
        public EmployeeLeaveRequestsByStatusSpecification(
            Guid employeeId,
            RequestStatus status)
            : base(r =>
                r.EmployeeId == employeeId &&
                r.Status == status)
        {   
        }
    }
}
