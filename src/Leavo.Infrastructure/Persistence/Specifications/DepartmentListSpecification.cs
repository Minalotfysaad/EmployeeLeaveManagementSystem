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
