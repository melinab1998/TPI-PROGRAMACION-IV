namespace Application.Models.Requests
{
    public class RegisterPatientRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Dni { get; set; }
    }
}
