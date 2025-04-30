import { LineRepository } from '@/src/domain/repositories/lineDomainRepo';
import { NextResponse } from 'next/server';

export class GetLineUseCase {
  constructor(private lineRepository: LineRepository) {}

  async execute(userId: number) {
    try{
      const response = await this.lineRepository.getLine(
        userId,
         );
      return response;
    } catch (error) {
      console.error("Error fetching polylines:", error);
      return NextResponse.json({ error: "Failed to fetch polylines" });
    }
   }
}