using EmployeeLeaveManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Infrastructure.Persistence.Configurations
{
    public class EmployeeLeaveBalanceConfiguration : IEntityTypeConfiguration<EmployeeLeaveBalance>
    {
        public void Configure(EntityTypeBuilder<EmployeeLeaveBalance> builder)
        {
            //Relationships
            builder.HasOne(lb => lb.Employee)
                .WithMany(e => e.EmployeeLeaveBalances)
                .HasForeignKey(lb => lb.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(lb => lb.LeaveType)
                .WithMany()
                .HasForeignKey(lb => lb.LeaveTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            //Indexes
            builder.HasIndex(lb => new { lb.EmployeeId, lb.LeaveTypeId })
                .IsUnique();
        }
    }
}
