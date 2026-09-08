using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
{
    public sealed class DepartmentByIdSpecification
        : BaseSpecification<Department>
    {
        public DepartmentByIdSpecification(Guid id)
            : base(d => d.Id == id)
        {
        }
    }
}
