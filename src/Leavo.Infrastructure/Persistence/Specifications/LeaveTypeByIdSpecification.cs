using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Persistence.Specifications
{
    public sealed class LeaveTypeByIdSpecification : BaseSpecification<LeaveType>
    {
        public LeaveTypeByIdSpecification(Guid id) : base(t => t.Id == id)
        {
            
        }
    }
}
