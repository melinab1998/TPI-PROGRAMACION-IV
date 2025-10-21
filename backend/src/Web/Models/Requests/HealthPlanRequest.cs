namespace Web.Models.Requests
{
    public record HealthPlanRequest(
        string Name,
        int HealthInsuranceId // Para relacionar con la obra social correspondiente
    );
}
