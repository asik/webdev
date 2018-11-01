using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace RecipesApi.Controllers
{

    [Route("auth")]
    public class AuthController : ControllerBase
    {
        //TODO use a DB
        readonly List<Credential> credentials = new List<Credential>
        {
            Credential.FromPlainTextPassword("john.doe@gmail.com", "John Doe", "123456")
        };

        [Route("login")]
        [HttpGet]
        public async Task<IActionResult> Login(LoginModel loginModel)
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
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return StatusCode(200);
        }

        //[Route("register")]
        //[HttpPost]
        //public async Task<IActionResult> Register(RegisterModel registerModel)
        //{
        //    //TODO add the user to some database
        //    var user = new User { Name = registerModel.Name, Email = registerModel.EmailAddress };

        //    return await SignInUser(user);
        //}

        private async Task<IActionResult> SignInUser(Credential credential)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, credential.EmailAddress),
                new Claim(ClaimTypes.Name, credential.Username),
                new Claim(ClaimTypes.Email, credential.EmailAddress)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(principal);

            return StatusCode(200);
        }
    }
}
