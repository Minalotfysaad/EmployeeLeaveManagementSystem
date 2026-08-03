using AutoMapper;
using EmployeeLeaveManagement.Application.DTOs.LeaveRequest;
using EmployeeLeaveManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Mappings
{
    public class LeaveRequestProfile : Profile
    {
        public LeaveRequestProfile()
        {
            CreateMap<CreateLeaveRequestDto, LeaveRequest>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.EmployeeId, opt => opt.Ignore())
                .ForMember(d => d.TotalDays, opt => opt.Ignore())
                .ForMember(d => d.Status, opt => opt.Ignore())
                .ForMember(d => d.CreatedAt, opt => opt.Ignore())
                .ForMember(d => d.Employee, opt => opt.Ignore())
                .ForMember(d => d.LeaveType, opt => opt.Ignore())
                .ForMember(d => d.Approval, opt => opt.Ignore());

            CreateMap<LeaveRequest, LeaveRequestDetailsDto>();
        }
    }
}
