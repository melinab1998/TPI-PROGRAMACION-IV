using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public record UpdateDentistInsurancesRequest(
        [Required(ErrorMessage = "Debe especificar al menos una obra social o una lista vacía")]
        List<int> HealthInsuranceIds
    );
}
