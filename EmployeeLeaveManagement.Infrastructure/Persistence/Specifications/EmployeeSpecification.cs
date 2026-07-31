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
    public sealed class EmployeeSpecification : BaseSpecification<Employee>
    {
        //Ctor
        public EmployeeSpecification(EmployeeQueryParameters parameters): base(BuildCriteria(parameters))
        {
            AddInclude(e => e.Department);
            ApplyOrderBy(e => e.FirstName);
            ApplyPaging((parameters.Page - 1) * parameters.PageSize, parameters.PageSize);
        }



        //Helper method
        private static Expression<Func<Employee, bool>> BuildCriteria(EmployeeQueryParameters parameters)
        {
            return employee =>
            // Search by name
            (string.IsNullOrWhiteSpace(parameters.Search) ||
                (employee.FirstName + " " + employee.LastName)
                    .Contains(parameters.Search))

            // Filter by Department
            && (!parameters.DepartmentId.HasValue ||
                employee.DepartmentId == parameters.DepartmentId);
        }
    }
}
