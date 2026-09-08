using AutoMapper;
using EmployeeLeaveManagement.Application.DTOs.Holiday;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Mappings
{
    public class HolidayProfile : Profile
    {
        public HolidayProfile()
        {
            CreateMap<CreateHolidayDto, Holiday>()
                .ForMember(d => d.CreatedById, opt => opt.Ignore())
                .ForMember(d => d.HR, opt => opt.Ignore())
                .ForMember(d => d.CreatedAt, opt => opt.Ignore());

            CreateMap<Holiday, HolidayDetailsDto>()
                .ForMember(d => d.CreatedBy, opt => opt.MapFrom(s => $"{s.HR!.FirstName} {s.HR!.LastName}"));

            CreateMap<Holiday, HolidaySummaryDto>();
        }
    }
}
