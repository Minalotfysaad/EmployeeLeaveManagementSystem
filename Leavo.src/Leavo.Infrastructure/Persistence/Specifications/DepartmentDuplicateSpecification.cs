using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
{
    public sealed class DepartmentDuplicateSpecification
        : BaseSpecification<Department>
    {
        public DepartmentDuplicateSpecification(string name)
            : base(d => d.Name.ToLower() == name.ToLower())
        {
        }

        public DepartmentDuplicateSpecification(
            Guid currentId,
            string name)
            : base(d =>
                d.Name.ToLower() == name.ToLower() &&
                d.Id != currentId)
        {
        }
    }
}
