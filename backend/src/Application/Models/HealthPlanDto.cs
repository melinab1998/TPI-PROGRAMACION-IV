using Domain.Entities;

namespace Application.Models;

public record HealthPlanDto(
    int Id,
    string Name
)
{
    public static HealthPlanDto Create(HealthPlan entity)
    {
        return new HealthPlanDto(entity.Id, entity.Name);
    }

    public static List<HealthPlanDto> CreateList(IEnumerable<HealthPlan> plans)
    {
        return plans.Select(plan => Create(plan)).ToList();
    }
}
