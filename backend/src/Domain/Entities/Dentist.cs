namespace Domain.Entities
{
    public class Dentist : User
    {
        public string LicenseNumber { get; set; }
        public bool IsActive { get; set; } = false;

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

        public void SetActiveStatus(bool isActive)
        {
            IsActive = isActive;
        }

        public void UpdateInfo(string? firstName, string? lastName, string? email, string? licenseNumber)
        {
            if (!string.IsNullOrEmpty(firstName)) FirstName = firstName;
            if (!string.IsNullOrEmpty(lastName)) LastName = lastName;
            if (!string.IsNullOrEmpty(email)) Email = email;
            if (!string.IsNullOrEmpty(licenseNumber)) LicenseNumber = licenseNumber;
        }
    }
}


