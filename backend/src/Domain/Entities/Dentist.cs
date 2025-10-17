namespace Domain.Entities
{
    public class Dentist : User
    {
        public string LicenseNumber { get; set; }
        public bool IsActive { get; private set; } = false;

        public Dentist() : base() { }

        public Dentist(string firstName, string lastName, string email, string licenseNumber)
            : base(firstName, lastName, email, null!)
        {
            LicenseNumber = licenseNumber;
            IsActive = false;
        }

        public void Activate(string password)
        {
            SetPassword(password);
            IsActive = true;
        }
    }
}


