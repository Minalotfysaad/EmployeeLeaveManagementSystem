using Leavo.Application.DTOs.Employee;
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
    public sealed class PendingHRLeaveRequestsSpecification : BaseSpecification<LeaveRequest>
    {
        public PendingHRLeaveRequestsSpecification(EmployeeQueryParameters parameters) : base(r => r.Status == RequestStatus.ManagerApproved)
        {
            AddInclude(r => r.Employee);
            AddInclude(r => r.Employee.Department);
            AddInclude(r => r.LeaveType);
            ApplyOrderByDescending(r => r.CreatedAt);
            ApplyPaging((parameters.Page - 1) * parameters.PageSize, parameters.PageSize);
        }
    }
}
