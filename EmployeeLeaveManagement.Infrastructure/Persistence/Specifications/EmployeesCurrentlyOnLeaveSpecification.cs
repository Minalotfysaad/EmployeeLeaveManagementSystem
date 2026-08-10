using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EmployeeLeaveManagement.Domain.Enums;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
{
    public sealed class EmployeesCurrentlyOnLeaveSpecification
        : BaseSpecification<Employee>
    {
        public EmployeesCurrentlyOnLeaveSpecification()
            : base(e =>
                e.LeaveRequests.Any(r =>
                    r.Status == RequestStatus.HRApproved &&
                    r.StartDate <= DateOnly.FromDateTime(DateTime.UtcNow) &&
                    r.EndDate >= DateOnly.FromDateTime(DateTime.UtcNow)))
        {
        }
    }
}
