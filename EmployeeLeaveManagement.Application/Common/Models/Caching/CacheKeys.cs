using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeLeaveManagement.Application.Common.Models.Caching
{
    public static class CacheKeys
    {
        public const string LeaveTypes = "leave-types";
        public const string Holidays = "holidays";

        public static string LeaveType(Guid id)
            => $"leave-types:{id}";

        public static string Holiday(Guid id)
            => $"holidays:{id}";
    }
}
