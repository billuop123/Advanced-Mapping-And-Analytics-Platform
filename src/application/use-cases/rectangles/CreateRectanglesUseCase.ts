// src/application/use-cases/CreateCircleUseCase.ts
import { RectangleRepository } from '@/src/domain/repositories/rectangleDomainRepo';
import {  handleRectangleOperation } from '@/src/helpers/handleOperations';


export class CreateRectangleUseCase {
  constructor(private rectangleRepository: RectangleRepository) {}

  async execute(userId: number, bounds: { southwest: { lat: number; lng: number }; northeast: { lat: number; lng: number } }) {
      const response = await this.rectangleRepository.createRectangle(
        userId,
        bounds,
        
      );
      const result = await handleRectangleOperation(response);
      return result;
   }
}