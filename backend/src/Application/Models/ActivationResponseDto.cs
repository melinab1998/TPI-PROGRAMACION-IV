namespace Application.Models
{
    public record ActivationResponseDto<T>(T Entity, string ActivationToken)
    {
        public static ActivationResponseDto<T> Create(T entity, string token)
        {
            return new ActivationResponseDto<T>(entity, token);
        }
    }

}

