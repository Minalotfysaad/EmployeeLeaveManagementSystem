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
    public class HolidayConfiguration : IEntityTypeConfiguration<Holiday>
    {
        public void Configure(EntityTypeBuilder<Holiday> builder)
        {
            //Properties
            builder.Property(h => h.Name)
                .HasMaxLength(50);

            //Relationships
            builder.HasOne(h => h.HR)
                .WithMany()
                .HasForeignKey(h => h.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
