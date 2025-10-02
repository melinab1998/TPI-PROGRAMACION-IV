namespace Domain.Entities;

public abstract class User
{

    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string Email { get; set; }

    protected string Password { get; set; }



    protected User() { }

    protected User(string firstName, string lastName, string email, string password)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Password = password;
        }


}