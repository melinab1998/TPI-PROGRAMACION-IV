using Application.Models;
using Application.Models.Requests;

namespace Application.Interfaces
{
    public interface IVisitRecordService
    {
        List<VisitRecordDto> GetAllVisitRecord();
        VisitRecordDto GetVisitRecordById(int id);
        VisitRecordDto CreateVisitRecord(CreateVisitRecordRequest request);
        VisitRecordDto UpdateVisitRecord(int id, UpdateVisitRecordRequest request);

    }
}
