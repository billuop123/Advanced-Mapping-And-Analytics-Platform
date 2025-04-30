// src/application/use-cases/CreateCircleUseCase.ts
import { RectangleRepository } from '@/src/domain/repositories/rectangleDomainRepo';
import { handlePolygonOperation, handleRectangleOperation } from '@/src/helpers/handleOperations';
export class DeleteRectangleUseCase {
  constructor(private rectangleRepository: RectangleRepository) {}

  async execute(userId: number, bounds: { southwest: { lat: number; lng: number }; northeast: { lat: number; lng: number } }) {
   
        const response = await this.rectangleRepository.deleteRectangle(
            userId,
            bounds
          );
        const result = await handleRectangleOperation(response);
        return result;
}
}