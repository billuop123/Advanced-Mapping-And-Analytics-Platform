
import { PolygonRepository } from '@/src/domain/repositories/polygonDomainRepo';
import { handleOperation, handlePolygonOperation } from '@/src/helpers/handleOperations';
import { LatLng } from 'leaflet';

export class CreatePolygonUseCase {
  constructor(private polygonRepository: PolygonRepository) {}

  async execute(userId: number, coords: LatLng[], type: string) {
      const response = await this.polygonRepository.createPolygon(
        userId,
        coords,
        type
      );
      const result = await handleOperation(response,"Create Polygon");
      return result;
   }
}