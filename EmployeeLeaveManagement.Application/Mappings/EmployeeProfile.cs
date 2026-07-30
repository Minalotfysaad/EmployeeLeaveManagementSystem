using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EmployeeLeaveManagement.Application.DTOs.Employee;
using EmployeeLeaveManagement.Domain.Entities;


namespace EmployeeLeaveManagement.Application.Mappings
{
    public sealed class EmployeeProfile : Profile
    {
        public EmployeeProfile()
        {
            CreateMap<Employee, EmployeeDetailsDto>()
                .ForMember( dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department != null? src.Department.Name: string.Empty));

            CreateMap<Employee, EmployeeSummaryDto>()
                .ForMember(des => des.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));
        }
    }
}
