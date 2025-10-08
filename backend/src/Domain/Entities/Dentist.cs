namespace Domain.Entities
{
    public class Dentist : User
    {
        public string LicenseNumber { get; private set; }
        public Dentist() : base() { }
        public Dentist(string firstName, string lastName, string email, string passwordHash, string licenseNumber)
            : base(firstName, lastName, email, passwordHash)
        {
            LicenseNumber = licenseNumber;
        }
    }
}


