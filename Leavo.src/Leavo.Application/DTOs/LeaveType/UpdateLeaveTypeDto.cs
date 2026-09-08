using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.DTOs.LeaveType
{
    public class UpdateLeaveTypeDto
    {
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public int DefaultDays { get; set; }
    }
}
