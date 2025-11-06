using System.Text.RegularExpressions;
using Domain.Exceptions;

namespace Domain.Entities
{
    public class Availability
    {
        public int Id { get; private set; }
        public DayOfWeek DayOfWeek { get; private set; }
        public TimeSpan StartTime { get; private set; }
        public TimeSpan EndTime { get; private set; }
        public int DentistId { get; private set; }

        protected Availability() { }

        public Availability(DayOfWeek dayOfWeek, string startTime, string endTime, int dentistId)
        {
            ValidateTimeFormat(startTime);
            ValidateTimeFormat(endTime);

            if (!Enum.IsDefined(typeof(DayOfWeek), dayOfWeek))
                throw new AppValidationException("INVALID_DAY_OF_WEEK");

            var start = TimeSpan.Parse(startTime);
            var end = TimeSpan.Parse(endTime);

            if (start >= end)
                throw new AppValidationException("INVALID_TIME_RANGE");

            DayOfWeek = dayOfWeek;
            StartTime = start;
            EndTime = end;
            DentistId = dentistId;
        }

        public void Update(DayOfWeek? dayOfWeek, string? startTime, string? endTime)
        {
            if (dayOfWeek.HasValue)
            {
                if (!Enum.IsDefined(typeof(DayOfWeek), dayOfWeek.Value))
                    throw new AppValidationException("INVALID_DAY_OF_WEEK");
                DayOfWeek = dayOfWeek.Value;
            }

            if (!string.IsNullOrEmpty(startTime))
            {
                ValidateTimeFormat(startTime);
                StartTime = TimeSpan.Parse(startTime);
            }

            if (!string.IsNullOrEmpty(endTime))
            {
                ValidateTimeFormat(endTime);
                EndTime = TimeSpan.Parse(endTime);
            }

            if (StartTime >= EndTime)
                throw new AppValidationException("INVALID_TIME_RANGE");
        }

        private static void ValidateTimeFormat(string time)
        {
            var regex = new Regex(@"^(?:[01]\d|2[0-3]):[0-5]\d$");
            if (!regex.IsMatch(time))
                throw new AppValidationException("INVALID_TIME_FORMAT");
        }
    }
}
