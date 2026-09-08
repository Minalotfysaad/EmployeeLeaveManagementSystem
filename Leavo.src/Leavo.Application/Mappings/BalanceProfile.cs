using AutoMapper;
using EmployeeLeaveManagement.Application.DTOs.Balance;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Mappings
{
    public class BalanceProfile : Profile
    {
        public BalanceProfile()
        {
            CreateMap<EmployeeLeaveBalance, BalanceDto>()
                .ForMember(dest => dest.LeaveType, opt => opt.MapFrom(src => src.LeaveType!.Name));
        }
    }
}
