using Application.Interfaces;
using Domain.Enums;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class CompletePendingTurnsJob : BackgroundService
    {
        // Servicio en segundo plano (BackgroundService) encargado de actualizar los turnos pendientes
        // cuya fecha ya haya pasado, marcándolos automáticamente como completados.
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<CompletePendingTurnsJob> _logger;

        public CompletePendingTurnsJob(IServiceScopeFactory scopeFactory, ILogger<CompletePendingTurnsJob> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        // Método principal que se ejecuta constantemente en segundo plano.
        // Cada minuto verifica si hay turnos pendientes cuya fecha y hora ya pasaron.
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("CompletePendingTurnsJob iniciado a las {Time}", DateTime.Now);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Verificando turnos pendientes a las {Time}", DateTime.Now);
                    MarkPendingTurnsAsCompleted();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al actualizar turnos pendientes");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        // Busca los turnos pendientes cuya fecha ya pasó y los marca como completados.
        private void MarkPendingTurnsAsCompleted()
        {
            using var scope = _scopeFactory.CreateScope();
            var turnService = scope.ServiceProvider.GetRequiredService<ITurnService>();

            var allTurns = turnService.GetAllTurns();

            var now = DateTime.Now;

            var pendingTurns = allTurns
                .Where(t => t.Status == TurnStatus.Pending && t.AppointmentDate <= now)
                .ToList();

            _logger.LogInformation("Turnos pendientes encontrados: {Count}", pendingTurns.Count);

            foreach (var turn in pendingTurns)
            {
                _logger.LogInformation("Marcando turno {Id} de {AppointmentDate} como Completado", turn.Id, turn.AppointmentDate);

                turn.Status = TurnStatus.Completed;

                turnService.UpdateTurn(turn.Id, new Application.Models.Requests.UpdateTurnRequest
                {
                    Status = TurnStatus.Completed
                });

                _logger.LogInformation("Turno {Id} actualizado correctamente", turn.Id);
            }
        }
    }
}


