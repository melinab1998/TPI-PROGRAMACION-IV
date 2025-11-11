using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces
{
    public interface ITurnService
    {
        List<TurnDto> GetAllTurns();
        TurnDto GetTurnById(int id);
        TurnDto CreateTurn(CreateTurnRequest request, string userId, string userRole);
        TurnDto UpdateTurn(int id, UpdateTurnRequest request);
        void DeleteTurn(int id);
        void CancelTurn(int id);

        
    }
}
