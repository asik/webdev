using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RecipesApi.Controllers
{

    [Route("auth")]
    public class AuthController : ControllerBase
    {
        //TODO use a real DB
        static readonly List<Credential> credentials = new List<Credential>
        {
            Credential.FromPlainTextPassword("jd@gmail.com", "123456")
        };

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var index = credentials.FindIndex(c => c.EmailAddress == loginModel.EmailAddress);
            if (index >= 0)
            {
                var credential = credentials[index];
                if (credential.PasswordMatches(loginModel.Password))
                {
                    return await SignInUser(credential);
                }
            }

            return StatusCode(400);
        }

        [Route("logout")]
        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return StatusCode(200);
        }

        [Route("register")]
        [HttpPost]
        public IActionResult Register([FromBody] RegisterModel registerModel)
        {
            if (credentials.Exists(c => c.EmailAddress == registerModel.EmailAddress))
            {
                return StatusCode(400); //TODO return specific error
            }
            credentials.Add(Credential.FromPlainTextPassword(registerModel.EmailAddress, registerModel.Password));
            return StatusCode(200);
        }

        private async Task<IActionResult> SignInUser(Credential credential)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, credential.EmailAddress),
                new Claim(ClaimTypes.Name, credential.EmailAddress),
                new Claim(ClaimTypes.Email, credential.EmailAddress)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(principal);

            return StatusCode(200);
        }
    }
}
