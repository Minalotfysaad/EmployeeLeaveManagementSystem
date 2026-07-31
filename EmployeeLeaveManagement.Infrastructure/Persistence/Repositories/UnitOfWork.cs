using EmployeeLeaveManagement.Application.Abstractions.Persistence;
using EmployeeLeaveManagement.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Repositories
{
    public sealed class UnitOfWork(EmployeeLeaveManagementDbContext _context) : IUnitOfWork
    {
        private readonly Dictionary<Type, object> _repositories = []; //For caching repos

        //Provide Repository
        public IGenericRepository<T> Repository<T>() where T : class
        {
            var entityType = typeof(T);

            if (_repositories.TryGetValue(entityType, out object? repository))
            {
                return (IGenericRepository<T>) repository;
            }

            else
            {
                var genericRepository = new GenericRepository<T>(_context);
                _repositories[entityType] = genericRepository;

                return genericRepository;
            }
        }

        //Save Changes
        public Task<int> SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }
    }
}
