using Leavo.Application.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Leavo.Application.DTOs.Employee
{
    public sealed class EmployeeQueryParameters : QueryParameters
    {
        public string? Search { get; set; }
        public Guid? DepartmentId { get; set; }
        public string? Role { get; set; }
    }
}
