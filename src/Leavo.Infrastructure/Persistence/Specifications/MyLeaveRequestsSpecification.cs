using Leavo.Application.DTOs.Employee;
using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Persistence.Specifications
{
    public sealed class MyLeaveRequestsSpecification : BaseSpecification<LeaveRequest>
    {
        public MyLeaveRequestsSpecification(Guid employeeId, EmployeeQueryParameters parameters) : base(r => r.EmployeeId == employeeId)
        {
            AddInclude(r => r.LeaveType);
            ApplyOrderByDescending(r => r.CreatedAt);
            ApplyPaging((parameters.Page - 1) * parameters.PageSize, parameters.PageSize);

        }
    }
}
