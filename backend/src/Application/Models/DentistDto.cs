using Domain.Entities;

namespace Application.Models
{
    public record AcceptedInsuranceDto(int Id, string Name);

    public record DentistDto(
        int Id,
        string FirstName,
        string LastName,
        string Email,
        string LicenseNumber,
        bool IsActive,
        List<AcceptedInsuranceDto> AcceptedInsurances
    )
    {
        public static DentistDto Create(Dentist entity)
        {
            var acceptedInsurances = entity.DentistHealthInsurances?
                .Select(dh => new AcceptedInsuranceDto(
                    dh.HealthInsuranceId,
                    dh.HealthInsurance?.Name ?? string.Empty
                ))
                .ToList() ?? new List<AcceptedInsuranceDto>();

            var dto = new DentistDto(
                entity.Id,
                entity.FirstName,
                entity.LastName,
                entity.Email,
                entity.LicenseNumber,
                entity.IsActive,
                acceptedInsurances
            );

            return dto;
        }

        public static List<DentistDto> CreateList(IEnumerable<Dentist> dentists)
        {
            return dentists.Select(Create).ToList();
        }
    }
}
