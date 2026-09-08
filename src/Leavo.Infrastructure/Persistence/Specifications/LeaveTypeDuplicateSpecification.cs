using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Persistence.Specifications
{
    public sealed class LeaveTypeDuplicateSpecification
        : BaseSpecification<LeaveType>
    {
        public LeaveTypeDuplicateSpecification(string name)
            : base(l => EF.Functions.Like(l.Name, name))
        {
        }

        public LeaveTypeDuplicateSpecification(Guid currentId, string name)
            : base(l =>
                l.Id != currentId &&
                EF.Functions.Like(l.Name, name))
        {
        }
    }
}
