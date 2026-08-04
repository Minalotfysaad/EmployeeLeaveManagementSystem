using EmployeeLeaveManagement.Application.DTOs.Employee;
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
    public sealed class PendingManagerLeaveRequestsSpecification : BaseSpecification<LeaveRequest>
    {
        public PendingManagerLeaveRequestsSpecification(EmployeeQueryParameters parameters) : base(r => r.Status == RequestStatus.Pending)
        {
            AddInclude(r => r.Employee);
            AddInclude(r => r.Employee.Department);
            AddInclude(r => r.LeaveType);
            ApplyOrderByDescending(r => r.CreatedAt);
            ApplyPaging((parameters.Page - 1) * parameters.PageSize,parameters.PageSize);
        }
    }
}
