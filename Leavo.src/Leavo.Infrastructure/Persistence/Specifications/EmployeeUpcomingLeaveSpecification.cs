using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using EmployeeLeaveManagement.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
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
