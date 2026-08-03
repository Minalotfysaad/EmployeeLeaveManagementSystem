
using EmployeeLeaveManagement.API.Extensions;
using EmployeeLeaveManagement.Application.Extentions;
using EmployeeLeaveManagement.Infrastructure.Extensions;
using EmployeeLeaveManagement.Infrastructure.Persistence.Seed;
using EmployeeLeaveManagement.Infrastructure.Persistence.Context;
using Microsoft.OpenApi;

namespace EmpolyeeLeaveManagement
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT token only. Swagger will prepend 'Bearer '."
                });
                options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecuritySchemeReference("Bearer"),
                        new List<string>()
                    }
                });
            });

            builder.Services.AddInfrastructureServices(builder.Configuration);
            builder.Services.AddApplicationServices();
            builder.Services.AddAPIServices();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseExceptionHandler();

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();

            await IdentitySeeder.SeedAsync(app.Services);

            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<EmployeeLeaveManagementDbContext>();
                await DatabaseSeeder.SeedAsync(context);
            }

            app.MapControllers();

            app.Run();
        }
    }
}
