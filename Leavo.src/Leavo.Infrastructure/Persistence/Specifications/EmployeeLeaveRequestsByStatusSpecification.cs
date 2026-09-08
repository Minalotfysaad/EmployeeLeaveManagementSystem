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
