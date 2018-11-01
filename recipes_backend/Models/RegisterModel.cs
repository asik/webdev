using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Security.Cryptography;

namespace RecipesApi.Controllers
{
    public class RegisterModel
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string EmailAddress { get; set; }
    }

    public class LoginModel
    {
        public string EmailAddress { get; set; }
        public string Password { get; set; }
    }


    class Credential
    {
        public string EmailAddress { get; }
        public string Username { get; }
        public string PasswordHash { get; }
        public string Salt { get; }
        public Credential(string email, string username, string passwordHash, string salt)
        {
            EmailAddress = email;
            Username = username;
            PasswordHash = passwordHash;
            Salt = salt;
        }

        static readonly RandomNumberGenerator rng = RandomNumberGenerator.Create();
        static byte[] Hash(string plainTextPassword, byte[] salt) =>
            KeyDerivation.Pbkdf2(plainTextPassword, salt, KeyDerivationPrf.HMACSHA256, 10000, 256 / 8);


        public static Credential FromPlainTextPassword(string email, string username, string plainTextPassword)
        {
            // generate a 128-bit salt using a secure PRNG
            var salt = new byte[128 / 8];
            rng.GetBytes(salt);
            var passwordHash = Hash(plainTextPassword, salt);

            return new Credential(email, username, Convert.ToBase64String(passwordHash), Convert.ToBase64String(salt));
        }

        public bool PasswordMatches(string password)
        {
            var saltBytes = Convert.FromBase64String(Salt);
            var hash = Convert.ToBase64String(Hash(password, saltBytes));
            return hash == PasswordHash;
        }
    }
}