// src/application/use-cases/CreateCircleUseCase.ts

import { ShapeRepository } from '@/src/domain/repositories/shapeDomainRepo';

import {  handleBatchCreateShapeOperation, handleLineOperation } from '@/src/helpers/handleOperations';



export class BatchCreateShapeUseCase {
  constructor(private shapeRepository: ShapeRepository) {}

  async execute(userId: number, shapes: any[]) {
      const response = await this.shapeRepository.batchCreateShapes(
        userId,
        shapes,
        
      );
      const result = await handleBatchCreateShapeOperation(response);
      return result;
   }
}