using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces
{
    public interface ITurnService
    {
        IEnumerable<TurnDto> GetAllTurns();
        TurnDto GetTurnById(int id);
        TurnDto CreateTurn(CreateTurnRequest request);
        TurnDto UpdateTurn(int id, UpdateTurnRequest request);
        void CancelTurn(int id);
    }
}
