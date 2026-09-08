using AutoMapper;
using EmployeeLeaveManagement.Application.DTOs.LeaveType;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Mappings
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
