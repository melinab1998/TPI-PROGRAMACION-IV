namespace Domain.Entities;
using System.Text.RegularExpressions;

public abstract class User
{

    public int Id { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }

    public string Email { get; private set; }

    protected string Password { get; private set; }



    protected User() { }

    protected User(string firstName, string lastName, string email, string password)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Password = password;

        ValidateUserData();
    }


    private void ValidateUserData()
    {
        if (string.IsNullOrWhiteSpace(FirstName))
            throw new ArgumentException("El nombre no puede estar vacío.");

        if (string.IsNullOrWhiteSpace(LastName))
            throw new ArgumentException("El nombre no puede estar vacío.");

        if (string.IsNullOrWhiteSpace(Email))
            throw new ArgumentException("El email no puede estar vacío.");

        if (!Regex.IsMatch(Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            throw new ArgumentException("El formato del email no es válido.");

        if (string.IsNullOrWhiteSpace(Password))
            throw new ArgumentException("La contraseña no puede estar vacío.");

         if (Password.Length < 6)
            throw new ArgumentException("La contraseña debe tener al menos 6 caracteres.");

        if (!Regex.IsMatch(Password, @"^(?=.*[A-Z])(?=.*\d).+$"))
            throw new ArgumentException("La contraseña debe contener al menos una mayúscula y un número.");
    }
    
    public bool VerifyPassword(string password)
    {
        return Password == password;
    }


}