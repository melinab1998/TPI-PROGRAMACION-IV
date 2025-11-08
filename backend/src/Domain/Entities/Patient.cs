namespace Domain.Entities
{
    public class Patient : User
    {
        public string Dni { get; private set; } = string.Empty;
        public DateOnly? BirthDate { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? City { get; set; }
        public string? MembershipNumber { get; set; }
        public int? HealthPlanId { get; set; }
        public HealthPlan? HealthPlan { get; set; }

        public Patient() { }

        public Patient(string firstName, string lastName, string email, string dni)
            : base(firstName, lastName, email, null!)
        {
            Dni = dni;
        }

        public void ChangePassword(string newHashedPassword)
        {
            SetPassword(newHashedPassword);
        }

        public void UpdatePersonalInfo(
            string? firstName,
            string? lastName,
            string? email,
            string? dni,
            string? address,
            string? phoneNumber,
            string? city,
            string? membershipNumber,
            DateOnly? birthDate,
            int? healthPlanId
        )
        {
            if (!string.IsNullOrEmpty(firstName)) FirstName = firstName;
            if (!string.IsNullOrEmpty(lastName)) LastName = lastName;
            if (!string.IsNullOrEmpty(email)) Email = email;
            if (!string.IsNullOrEmpty(dni)) Dni = dni;
            if (!string.IsNullOrEmpty(address)) Address = address;
            if (!string.IsNullOrEmpty(phoneNumber)) PhoneNumber = phoneNumber;
            if (!string.IsNullOrEmpty(city)) City = city;
            if (!string.IsNullOrEmpty(membershipNumber)) MembershipNumber = membershipNumber;
            if (birthDate.HasValue) BirthDate = birthDate;
            if (healthPlanId.HasValue) HealthPlanId = healthPlanId.Value;
        }
    }
}