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
    public sealed class ManagerEmployeesCurrentlyOnLeaveSpecification
        : BaseSpecification<Employee>
    {
        public ManagerEmployeesCurrentlyOnLeaveSpecification(Guid managerId)
            : base(e =>
                e.ManagerId == managerId &&
                e.LeaveRequests.Any(r =>
                    r.Status == RequestStatus.HRApproved &&
                    r.StartDate <= DateOnly.FromDateTime(DateTime.UtcNow) &&
                    r.EndDate >= DateOnly.FromDateTime(DateTime.UtcNow)))
        {
        }
    }
}
