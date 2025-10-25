namespace Web.Models
{
    public record HealthInsuranceDto(
        int Id,
        string Name,
        IEnumerable<HealthPlanDto> Plans
    );
}
