// src/application/use-cases/CreateCircleUseCase.ts
import { PolygonRepository } from '@/src/domain/repositories/polygonDomainRepo';
import { handlePolygonOperation } from '@/src/helpers/handleOperations';
import { LatLng } from 'leaflet';

export class CreatePolygonUseCase {
  constructor(private polygonRepository: PolygonRepository) {}

  async execute(userId: number, coords: LatLng[], type: string) {
      const response = await this.polygonRepository.createPolygon(
        userId,
        coords,
        type
      );
      const result = await handlePolygonOperation(response);
      return result;
   }
}