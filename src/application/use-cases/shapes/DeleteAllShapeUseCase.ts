// src/application/use-cases/CreateCircleUseCase.ts

import { ShapeRepository } from '@/src/domain/repositories/shapeDomainRepo';

import {  handleDeleteAllShapeOperation, handleLineOperation } from '@/src/helpers/handleOperations';



export class DeleteAllShapeUseCase {
  constructor(private shapeRepository: ShapeRepository) {}
    
  async execute(userId: number) {
      const response = await this.shapeRepository.deleteAllShapes(
        userId,
        
      );
      const result = await handleDeleteAllShapeOperation(response);
      return result;
   }
}