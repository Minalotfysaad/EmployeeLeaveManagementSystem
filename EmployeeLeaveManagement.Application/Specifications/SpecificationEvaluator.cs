using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Specifications
{
    public static class SpecificationEvaluator<T> where T : class
    {
        // Query Generator
        public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T> specification,bool evaluatePaging = true)
        {
            // Starting point
            var query = inputQuery;

            // Criteria (WHERE)
            if (specification.Criteria is not null)
            {
                query = query.Where(specification.Criteria);
            }

            // Includes
            foreach (var includeExpression in specification.Includes)
            {
                query = query.Include(includeExpression);
            }

            //As No Tracking
            if (specification.AsNoTracking)
            {
                query = query.AsNoTracking();
            }

            // Ordering
            if (specification.OrderBy is not null)
            {
                query = query.OrderBy(specification.OrderBy);
            }
            else if (specification.OrderByDescending is not null)
            {
                query = query.OrderByDescending(specification.OrderByDescending);
            }

            // Paging (optional)
            if (evaluatePaging && specification.IsPagingEnabled)
            {
                query = query
                    .Skip(specification.Skip)
                    .Take(specification.Take);
            }

            // Return Final Query
            return query;
        }
    }
}
