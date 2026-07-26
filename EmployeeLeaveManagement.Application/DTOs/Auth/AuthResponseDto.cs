using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Email { get; set; } = default!;
        public string Token { get; set; } = default!;
        public string FullName { get; set; } = default!;
    }
}
