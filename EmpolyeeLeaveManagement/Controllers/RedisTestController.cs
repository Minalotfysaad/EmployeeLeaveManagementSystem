using EmployeeLeaveManagement.Application.Abstractions.Caching;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeLeaveManagement.API.Controllers
{
    [ApiController]
    public class RedisTestController(ICacheService _cacheService) : ApiControllerBase
    {

        [HttpGet("redis-test")]
        public async Task<ActionResult<string>> RedisTest()
        {
            const string key = "test:redis";

            await _cacheService.SetAsync(
                key,
                "Redis is working!",
                TimeSpan.FromMinutes(5));

            var value = await _cacheService.GetAsync<string>(key);

            return Ok(value);
        }
    }
}
