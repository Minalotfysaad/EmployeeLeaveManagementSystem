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
    public sealed class LeaveRequestOverlapSpecification : BaseSpecification<LeaveRequest>
    {
        public LeaveRequestOverlapSpecification(Guid employeeId, DateOnly startDate, DateOnly endDate)
            : base(lr =>
                lr.EmployeeId == employeeId &&
                    (
                        lr.Status == RequestStatus.Pending ||
                        lr.Status == RequestStatus.ManagerApproved ||
                        lr.Status == RequestStatus.HRApproved
                    ) &&
                    startDate <= lr.EndDate &&
                    endDate >= lr.StartDate)
        {
        }
    }
}
