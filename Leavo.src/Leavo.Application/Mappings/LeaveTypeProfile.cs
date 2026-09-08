using AutoMapper;
using Leavo.Application.DTOs.LeaveType;
using Leavo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.Mappings
{
    public class LeaveTypeProfile : Profile
    {
        public LeaveTypeProfile()
        {
            CreateMap<CreateLeaveTypeDto, LeaveType>();
            CreateMap<UpdateLeaveTypeDto, LeaveType>();
            CreateMap<LeaveType, LeaveTypeSummaryDto>();
            CreateMap<LeaveType, LeaveTypeDetailsDto>();
        }
    }
}
