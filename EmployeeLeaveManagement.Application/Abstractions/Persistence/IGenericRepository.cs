using EmployeeLeaveManagement.Application.Specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Abstractions.Persistence
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> FirstOrDefaultAsync(ISpecification<T> specification);
        Task<List<T>> ListAsync(ISpecification<T> specification);
        Task<int> CountAsync(ISpecification<T> specification);
        Task<bool> AnyAsync(ISpecification<T> specification);
        Task AddAsync(T entity);
        void Remove(T entity);
    }
}
