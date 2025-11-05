using Domain.Entities;

namespace Application.Models;

public record HealthInsuranceDto(
    int Id,
    string Name,
    IEnumerable<HealthPlanDto> Plans
)
{
    public static HealthInsuranceDto Create(HealthInsurance entity)
    {
        var plans = entity.Plans?.Select(plan => new HealthPlanDto(plan.Id, plan.Name))
        ?? Enumerable.Empty<HealthPlanDto>();

        return new HealthInsuranceDto(entity.Id, entity.Name, plans);
    }

    public static List<HealthInsuranceDto> CreateList(IEnumerable<HealthInsurance> insurances)
    {
        return insurances.Select(insurance => Create(insurance)).ToList();
    }
}
