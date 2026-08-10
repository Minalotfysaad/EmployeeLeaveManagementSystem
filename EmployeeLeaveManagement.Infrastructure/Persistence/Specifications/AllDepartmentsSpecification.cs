using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
{
    public sealed class AllDepartmentsSpecification
        : BaseSpecification<Department>
    {
        public AllDepartmentsSpecification()
            : base(d => true)
        {
        }
    }
}
