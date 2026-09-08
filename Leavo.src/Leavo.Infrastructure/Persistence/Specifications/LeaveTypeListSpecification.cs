using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
{
    public sealed class LeaveTypeListSpecification : BaseSpecification<LeaveType>
    {
        public LeaveTypeListSpecification(EmployeeQueryParameters parameters) : base()
        {
            ApplyNoTracking();
            ApplyOrderBy(l  => l.Name);
            ApplyPaging((parameters.Page - 1) * parameters.PageSize,parameters.PageSize);
        }
    }
}
