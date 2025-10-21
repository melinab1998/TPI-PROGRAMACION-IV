namespace Web.Models
{
    public record HealthPlanResponseDto(
        int Id,
        string Name,
        int HealthInsuranceId // Para saber a qué obra social pertenece
    );
}
