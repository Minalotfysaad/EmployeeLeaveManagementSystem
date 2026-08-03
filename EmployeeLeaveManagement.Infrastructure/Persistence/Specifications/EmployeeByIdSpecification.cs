using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
{
    public sealed class EmployeeByIdSpecification : BaseSpecification<Employee>
    {
        public EmployeeByIdSpecification(Guid id) : base(e => e.Id == id)
        {
            AddInclude(e => e.Department);
        }
    }
}
