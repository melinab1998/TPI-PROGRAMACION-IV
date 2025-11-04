using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Application.Models.Requests
{
    public record UpdateAvailabilityRequest(
        
        DayOfWeek? DayOfWeek,

        string?  StartTime,

        
        string? EndTime
    );
}
