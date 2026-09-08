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
    public class EmployeeUpcomingLeaveSpecification : BaseSpecification<LeaveRequest>
    {
        public EmployeeUpcomingLeaveSpecification(Guid employeeId)
            :base(r => 
                r.Id == employeeId &&
                r.Status == RequestStatus.HRApproved &&
                r.StartDate > DateOnly.FromDateTime(DateTime.UtcNow))
        {
        }
    }
}
