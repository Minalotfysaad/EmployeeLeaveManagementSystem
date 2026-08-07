using EmployeeLeaveManagement.Application.Common.Models;
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
    public sealed class HolidayListSpecification : BaseSpecification<Holiday>
    {
        public HolidayListSpecification(EmployeeQueryParameters parameters) : base()
        {
            AddInclude(h => h.HR);
            ApplyOrderBy(h => h.StartDate);

            ApplyPaging((parameters.Page - 1) * parameters.PageSize, parameters.PageSize);
        }
    }
}
