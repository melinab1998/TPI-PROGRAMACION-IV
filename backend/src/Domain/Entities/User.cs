using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public abstract class User
    {
        public int Id { get; private set; }
        public string FirstName { get;  set; }
        public string LastName { get;  set; }
        public string Email { get;  set; }
        public string Password { get; private set; }
        
        [NotMapped]
        public string Token { get; set; }

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