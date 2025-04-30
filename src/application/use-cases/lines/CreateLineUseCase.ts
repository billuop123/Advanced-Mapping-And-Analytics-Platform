// src/application/use-cases/CreateCircleUseCase.ts
import { LineRepository } from '@/src/domain/repositories/lineDomainRepo';

import {  handleLineOperation } from '@/src/helpers/handleOperations';
import { LatLng } from 'leaflet';


export class CreateLineUseCase {
  constructor(private lineRepository: LineRepository) {}

  async execute(userId: number, coords: LatLng[]) {
      const response = await this.lineRepository.createLine(
        userId,
        coords,
        
      );
      const result = await handleLineOperation(response);
      return result;
   }
}