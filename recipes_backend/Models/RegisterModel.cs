namespace RecipesApi.Controllers
{
    public class RegisterModel
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }

    public class LoginModel
    {
        public string Name { get; set; }
        public string Password { get; set; }
    }

    public class User
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }
}