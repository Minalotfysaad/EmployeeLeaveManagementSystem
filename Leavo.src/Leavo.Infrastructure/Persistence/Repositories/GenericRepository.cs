using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Application.Specifications;
using EmployeeLeaveManagement.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly EmployeeLeaveManagementDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(EmployeeLeaveManagementDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<List<T>> ListAsync(ISpecification<T> specification)
        {
            var query = SpecificationEvaluator<T>.GetQuery(_dbSet, specification);

            return await query.ToListAsync();
        }

        public async Task<List<T>> ListAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T?> FirstOrDefaultAsync(ISpecification<T> specification)
        {
            var query = SpecificationEvaluator<T>.GetQuery(_dbSet, specification);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<int> CountAsync(ISpecification<T> specification)
        {
            var query = SpecificationEvaluator<T>.GetQuery( _dbSet, specification, evaluatePaging: false);

            return await query.CountAsync();
        }

        public async Task<bool> AnyAsync(ISpecification<T> specification)
        {
            var query = SpecificationEvaluator<T>.GetQuery( _dbSet, specification);

            return await query.AnyAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }


    }
}
