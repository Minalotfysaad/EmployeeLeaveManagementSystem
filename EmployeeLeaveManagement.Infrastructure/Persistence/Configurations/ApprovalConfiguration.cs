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
    public class ApprovalConfiguration : IEntityTypeConfiguration<Approval>
    {
        public void Configure(EntityTypeBuilder<Approval> builder)
        {
            builder.HasOne(a => a.LeaveRequest)
                .WithOne(r => r.Approval)
                .HasForeignKey<Approval>(a => a.LeaveRequestId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.Manager)
                .WithMany()
                .HasForeignKey(a => a.ManagerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.HR)
                .WithMany()
                .HasForeignKey(a => a.HRId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
