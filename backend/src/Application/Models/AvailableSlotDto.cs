namespace Application.Models
{
    public record AvailableSlotDto(string Date, List<string> Hours)
    {
        public static AvailableSlotDto Create(string date, List<string> hours)
        {
            return new AvailableSlotDto(date, hours);
        }

        public static List<AvailableSlotDto> CreateList(IEnumerable<(string date, List<string> hours)> items)
        {
            return items.Select(i => Create(i.date, i.hours)).ToList();
        }
    }

}
