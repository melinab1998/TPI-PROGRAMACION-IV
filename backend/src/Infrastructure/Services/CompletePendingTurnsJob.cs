using Application.Interfaces;
using Domain.Enums;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class CompletePendingTurnsJob : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<CompletePendingTurnsJob> _logger;

        public CompletePendingTurnsJob(IServiceScopeFactory scopeFactory, ILogger<CompletePendingTurnsJob> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("CompletePendingTurnsJob iniciado a las {Time}", DateTime.UtcNow);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Verificando turnos pendientes a las {Time}", DateTime.UtcNow);
                    MarkPendingTurnsAsCompleted();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al actualizar turnos pendientes");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        private void MarkPendingTurnsAsCompleted()
        {
            using var scope = _scopeFactory.CreateScope();
            var turnService = scope.ServiceProvider.GetRequiredService<ITurnService>();

            var allTurns = turnService.GetAllTurns();

            var now = DateTime.UtcNow;

            var pendingTurns = allTurns
                .Where(t => t.Status == TurnStatus.Pending && t.AppointmentDate <= now)
                .ToList();

            _logger.LogInformation("Turnos pendientes encontrados: {Count}", pendingTurns.Count);

            foreach (var turn in pendingTurns)
            {
                _logger.LogInformation("Marcando turno {Id} de {AppointmentDate} como Completado", turn.Id, turn.AppointmentDate);

                var updatedTurn = turn with { Status = TurnStatus.Completed };

                turnService.UpdateTurn(updatedTurn.Id, new Application.Models.Requests.UpdateTurnRequest
                {
                    Status = TurnStatus.Completed
                });

                _logger.LogInformation("Turno {Id} actualizado correctamente", updatedTurn.Id);
            }
        }
    }
}


