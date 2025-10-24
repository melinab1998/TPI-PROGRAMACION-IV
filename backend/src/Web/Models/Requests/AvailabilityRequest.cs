using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Web.Models.Requests
{
    public record AvailabilityRequest(
        [Required]
        DayOfWeek DayOfWeek,

        [Required]
        string  StartTime,

        [Required]
        string  EndTime
    );
}
