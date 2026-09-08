using Leavo.Application.Abstractions.Services;
using Leavo.Application.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Leavo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService _authService) : ApiControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> RegisterAsync([FromBody] RegisterRequestDto dto)
            => Ok(await _authService.RegisterAsync(dto));

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> LoginAsync([FromBody] LoginRequestDto dto)
            => Ok(await _authService.LoginAsync(dto));

    }
}

