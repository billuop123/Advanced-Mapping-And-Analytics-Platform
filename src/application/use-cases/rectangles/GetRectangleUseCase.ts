// src/application/use-cases/CreateCircleUseCase.ts
import { RectangleRepository } from '@/src/domain/repositories/rectangleDomainRepo';
import { handlePolygonOperation } from '@/src/helpers/handleOperations';
import { NextResponse } from 'next/server';
export class GetRectangleUseCase {
  constructor(private rectangleRepository: RectangleRepository) {}

  async execute(userId: number) {
    try{
        const response = await this.rectangleRepository.getRectangle(
            userId,
          );
          return response;
    }catch(error){
        console.error("Error fetching rectangles:", error);
        return NextResponse.json(
          { error: "Failed to fetch rectangles" },
          { status: 500 }
        );
    } }
}