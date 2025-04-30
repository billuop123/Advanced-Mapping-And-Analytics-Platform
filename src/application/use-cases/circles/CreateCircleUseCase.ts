// src/application/use-cases/CreateCircleUseCase.ts
import { CircleRepository } from '@/src/domain/repositories/circleDomainRepo';
import { LatLng } from 'leaflet';
import { NextResponse } from 'next/server';

export class CreateCircleUseCase {
  constructor(private circleRepository: CircleRepository) {}

  async execute(userId: number, center: LatLng, radius: number, type: string) {
    try {
      const response = await this.circleRepository.createCircle(
        userId,
        { center, radius },
        radius,
        type
      );
      return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Failed to create circle" },
            { status: 500 }
        );
    }
  }
}