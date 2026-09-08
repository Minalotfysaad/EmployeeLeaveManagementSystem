using EmployeeLeaveManagement.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Context
{
    public class EmployeeLeaveManagementDbContext : IdentityDbContext<Employee, IdentityRole<Guid>, Guid>
    {

        //ctor
        public EmployeeLeaveManagementDbContext(DbContextOptions<EmployeeLeaveManagementDbContext> options): base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(typeof(EmployeeLeaveManagementDbContext).Assembly);
        }

        //DbSets

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<LeaveType> LeaveTypes { get; set; }
        public DbSet<EmployeeLeaveBalance> EmployeeLeaveBalances { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }
        public DbSet<Approval> Approvals { get; set; }
        public DbSet<Holiday> Holidays { get; set; }
    }
}
