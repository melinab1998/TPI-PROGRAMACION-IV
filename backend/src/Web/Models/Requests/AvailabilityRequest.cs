using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Web.Models.Requests
{
    public record AvailabilityRequest(
        [Required]
        WorkDay DayOfWeek,

        [Required]
        TimeOnly StartTime,

        [Required]
        TimeOnly EndTime
    );
}
