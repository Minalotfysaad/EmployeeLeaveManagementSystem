using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Specifications
{
    public sealed class HolidayDuplicateSpecification : BaseSpecification<Holiday>
    {
        public HolidayDuplicateSpecification(
            string name,
            DateTime startDate,
            DateTime endDate)
            : base(h =>
                h.Name == name &&
                h.StartDate == startDate &&
                h.EndDate == endDate)
        {
        }

        public HolidayDuplicateSpecification(
            Guid currentId,
            string name,
            DateTime startDate,
            DateTime endDate)
            : base(h =>
                h.Name == name &&
                h.StartDate == startDate &&
                h.EndDate == endDate &&
                h.Id != currentId)
        { 
        }
    }
}
