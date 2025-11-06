namespace Application.Models
{
    public record ActivationResponseDto<T>(
    T Entity,
    string ActivationToken
);

}