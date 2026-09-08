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
