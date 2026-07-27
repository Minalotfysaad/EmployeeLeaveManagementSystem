
using EmployeeLeaveManagement.Infrastructure.Extensions;
using EmployeeLeaveManagement.Infrastructure.Persistence.Seed;

namespace EmpolyeeLeaveManagement
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddInfrastructureServices(builder.Configuration);
            builder.Services.AddControllers();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            await IdentitySeeder.SeedAsync(app.Services);
            app.Run();
        }
    }
}
