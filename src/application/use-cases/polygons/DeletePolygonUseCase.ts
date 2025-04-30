import { PolygonRepository } from '@/src/domain/repositories/polygonDomainRepo';
import { handlePolygonOperation } from '@/src/helpers/handleOperations';
import { LatLng } from 'leaflet';
import { NextResponse } from 'next/server';

export class DeletePolygonUseCase {
  constructor(private polygonRepository: PolygonRepository) {}

  async execute(userId: number,coords:LatLng[]) {
   
      const response = await this.polygonRepository.deletePolygon(userId,coords);
      const result = await handlePolygonOperation(response);
      return result;
    } 
  
}