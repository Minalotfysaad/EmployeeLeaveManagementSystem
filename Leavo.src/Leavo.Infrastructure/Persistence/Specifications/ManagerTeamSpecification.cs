using Leavo.Application.Specifications;
using Leavo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Infrastructure.Persistence.Specifications
{
    public sealed class ManagerTeamSpecification : BaseSpecification<Employee>
    {
        public ManagerTeamSpecification(Guid managerId)
            : base(e => e.ManagerId == managerId)
        {
        }
    }
}
