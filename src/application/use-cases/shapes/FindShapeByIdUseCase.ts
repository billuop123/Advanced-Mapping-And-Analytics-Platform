// src/application/use-cases/CreateCircleUseCase.ts

import { ShapeRepository } from '@/src/domain/repositories/shapeDomainRepo';

import {  handleGetShapeByIdOperation } from '@/src/helpers/handleOperations';



export class FindShapeByIdUseCase {
  constructor(private shapeRepository: ShapeRepository) {}
    
  async execute(shapeId: number) {
      const response = await this.shapeRepository.getShapeById(
       
        shapeId
        
      );
      const result = await handleGetShapeByIdOperation(response);
      return result;
   }
}