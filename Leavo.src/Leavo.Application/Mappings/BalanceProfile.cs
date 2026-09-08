using AutoMapper;
using Leavo.Application.DTOs.Balance;
using Leavo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Mappings
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
