namespace Web.Models
{
    public record HealthInsuranceResponseDto(
        int Id,
        string Name,
        IEnumerable<HealthPlanResponseDto> Plans
    );
}
