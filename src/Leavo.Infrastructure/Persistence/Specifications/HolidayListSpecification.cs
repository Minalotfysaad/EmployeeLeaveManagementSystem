using Leavo.Application.Common.Models;
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
    public sealed class HolidayListSpecification : BaseSpecification<Holiday>
    {
        public HolidayListSpecification(EmployeeQueryParameters parameters) : base()
        {
            AddInclude(h => h.HR);
            ApplyNoTracking();
            ApplyOrderBy(h => h.StartDate);
            ApplyPaging((parameters.Page - 1) * parameters.PageSize, parameters.PageSize);
        }
    }
}
