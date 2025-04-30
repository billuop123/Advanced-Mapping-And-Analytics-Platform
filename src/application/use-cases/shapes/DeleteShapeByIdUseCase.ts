
import { ShapeRepository } from '@/src/domain/repositories/shapeDomainRepo';

import {  handleDeleteShapeByIdOperation } from '@/src/helpers/handleOperations';



export class DeleteShapeByIdUseCase {
  constructor(private shapeRepository: ShapeRepository) {}
    
  async execute(shapeId: number) {
      const response = await this.shapeRepository.deleteShapeById(
       
        shapeId
        
      );
      const result = await handleDeleteShapeByIdOperation(response);
      return result;
   }
}