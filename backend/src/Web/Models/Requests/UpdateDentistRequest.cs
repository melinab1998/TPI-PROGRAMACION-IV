namespace Web.Models.Requests;

public record UpdateDentistRequest(
    string? FirstName,
    string? LastName,
    string? Email,
    string? LicenseNumber
);