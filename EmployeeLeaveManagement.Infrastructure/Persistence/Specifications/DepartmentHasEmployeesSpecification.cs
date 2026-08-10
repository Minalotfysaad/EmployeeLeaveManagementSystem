using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
{
    public sealed class DepartmentHasEmployeesSpecification
        : BaseSpecification<Employee>
    {
        public DepartmentHasEmployeesSpecification(Guid departmentId)
            : base(e => e.DepartmentId == departmentId)
        {
        }
    }
}
