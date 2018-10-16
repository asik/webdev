using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RecipesApi.Controllers
{
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        [Route("login")]
        [HttpGet]
        public async Task<IActionResult> Login(LoginModel loginModel)
        {
            //TODO validate that this is a real user

            var user = new User { Name = "blargh", Email = "todo!!!!" };

            return await SignInUser(user);
        }

        [Route("logout")]
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return StatusCode(200);
        }

        [Route("register")]
        [HttpPost]
        public async Task<IActionResult> Register(RegisterModel registerModel)
        {
            //TODO add the user to some database
            var user = new User { Name = registerModel.Name, Email = registerModel.Email };

            return await SignInUser(user);
        }

        private async Task<IActionResult> SignInUser(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(principal);

            return StatusCode(200);
        }
    }
}
