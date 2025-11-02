namespace Application.Models
{
    public class AvailableSlotDto
    {
        public string Date { get; set; } = default!;
        public List<string> Hours { get; set; } = new();
    }
}
