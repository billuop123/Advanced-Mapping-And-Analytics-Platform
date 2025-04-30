// src/application/use-cases/CreateCircleUseCase.ts
import { CircleRepository } from '@/src/domain/repositories/circleDomainRepo';
import { NextResponse } from 'next/server';

export class GetCircleUseCase {
  constructor(private circleRepository: CircleRepository) {}

  async execute(userId: number) {
    try {
      const response = await this.circleRepository.getCircle(userId);
      return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Failed to get circle" },
            { status: 500 }
        );
    }
  }
}