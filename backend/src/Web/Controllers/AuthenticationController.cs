using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Application.Models;
using Application.Models.Requests;
using Domain.Entities;

namespace Web.Controllers
{
    [Route("api/authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ICustomAuthenticationService _authService;

        public AuthenticationController(ICustomAuthenticationService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public ActionResult<AuthenticationResponseDto> Login([FromBody] AuthenticationRequest dto)
        {
            // Ahora Authenticate devuelve AuthenticationResponseDto
            var response = _authService.Authenticate(dto);
            if (response == null)
                return Unauthorized("Email o contraseña incorrectos.");

            return Ok(response);
        }

        [HttpPost("register")]
        public ActionResult<User> Register([FromBody] RegisterUserRequest dto)
        {
            try
            {
                var user = _authService.RegisterUser(dto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
