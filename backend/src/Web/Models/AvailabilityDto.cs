using Domain.Entities;
using Domain.Enums;

namespace Web.Models
{
    public record AvailabilityDto(int Id, WorkDay DayOfWeek, TimeOnly StartTime, TimeOnly EndTime)
    {
        public static AvailabilityDto Create(Availability entity)
        {
            return new AvailabilityDto(entity.Id, entity.DayOfWeek, entity.StartTime, entity.EndTime);
        }
    }
}
