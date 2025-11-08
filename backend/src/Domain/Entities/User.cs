using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public abstract class User
    {
        public int Id { get; private set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        [NotMapped]
        public string Token { get; set; } = string.Empty;

        protected User() { }

        protected User(string firstName, string lastName, string email, string password)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Password = password;
        }

        public void SetPassword(string hashedPassword)
        {
            Password = hashedPassword;
        }
    }
}