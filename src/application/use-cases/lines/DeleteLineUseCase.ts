// src/application/use-cases/CreateCircleUseCase.ts
import { LineRepository } from '@/src/domain/repositories/lineDomainRepo';

import { handleOperation } from '@/src/helpers/handleOperations';
import { LatLng } from 'leaflet';


export class DeleteLineUseCase {
  constructor(private lineRepository: LineRepository) {}

  async execute(userId: number, coords: LatLng[]) {
      const response = await this.lineRepository.deleteSingleLine(
        userId,
        coords,
        
      );
      const result = await handleOperation(response,"Delete Line");
      return result;
   }
}