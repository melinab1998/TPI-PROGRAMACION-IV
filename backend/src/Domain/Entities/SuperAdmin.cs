namespace Domain.Entities
{
    public class SuperAdmin : User
    {
        public SuperAdmin() : base() { }

        public SuperAdmin(string firstName, string lastName, string email, string password)
            : base(firstName, lastName, email, password)
        {
            SetPassword(password);
        }
    }
}
