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
    public sealed class DepartmentListSpecification
        : BaseSpecification<Department>
    {
        public DepartmentListSpecification(
            EmployeeQueryParameters parameters)
            : base()
        {
            ApplyOrderBy(d => d.Name);
            ApplyNoTracking();
            ApplyPaging(
                (parameters.Page - 1) * parameters.PageSize,
                parameters.PageSize);
        }
    }
}
