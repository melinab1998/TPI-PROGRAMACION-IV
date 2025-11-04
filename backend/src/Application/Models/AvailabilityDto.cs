using Domain.Entities;


namespace Application.Models
{
    public record AvailabilityDto(int Id, DayOfWeek DayOfWeek, string StartTime, string EndTime)
    {
        public static AvailabilityDto Create(Availability entity)
        {
            return new AvailabilityDto(entity.Id, entity.DayOfWeek, entity.StartTime.ToString(@"hh\:mm"),
                entity.EndTime.ToString(@"hh\:mm"));
        }
        
        public static List<AvailabilityDto> CreateList(IEnumerable<Availability> availabilities)
    {
        return availabilities.Select(availability => Create(availability)).ToList();
    }
    }
}
