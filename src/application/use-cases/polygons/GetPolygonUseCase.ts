// src/application/use-cases/CreateCircleUseCase.ts
import { PolygonRepository } from '@/src/domain/repositories/polygonDomainRepo';
import { LatLng } from 'leaflet';
import { NextResponse } from 'next/server';

export class GetPolygonUseCase {
  constructor(private polygonRepository: PolygonRepository) {}

  async execute(userId: number) {
    try {
      const response = await this.polygonRepository.getPolygon(userId);
      return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Failed to create Polygon" },
            { status: 500 }
        );
    }
  }
}