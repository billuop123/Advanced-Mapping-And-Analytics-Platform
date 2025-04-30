// src/application/use-cases/CreateCircleUseCase.ts
import { CircleRepository } from '@/src/domain/repositories/circleDomainRepo';
import { LatLng } from 'leaflet';
import { NextResponse } from 'next/server';

export class DeleteCircleUseCase {
  constructor(private circleRepository: CircleRepository) {}

  async execute(userId: number, center: LatLng, radius: number) {
    try {
      const response = await this.circleRepository.deleteSingleCircle(userId,radius,center);
      return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Failed to delete circle" },
            { status: 500 }
        );
    }
  }
}