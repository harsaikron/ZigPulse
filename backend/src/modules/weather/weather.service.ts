import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class WeatherService {
  constructor(private prisma: PrismaService) {}

  async getCurrent() {
    const snapshots = await this.prisma.weatherSnapshot.findMany({
      orderBy: { date: 'asc' },
      take: 7,
    });
    const today = snapshots[0] || null;
    return {
      today,
      forecast: snapshots,
      elNinoConfidence: today?.elNinoConfidence ?? 72,
    };
  }
}
