import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CommandCentreService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [opportunities, events, weatherSnaps, transportAlerts, aiRecs] =
      await Promise.all([
        this.prisma.opportunity.findMany({
          where: { dismissed: false },
          orderBy: { score: 'desc' },
        }),
        this.prisma.event.findMany({
          orderBy: { startDate: 'asc' },
          take: 5,
        }),
        this.prisma.weatherSnapshot.findMany({
          orderBy: { date: 'asc' },
          take: 7,
        }),
        this.prisma.transportAlert.findMany({
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.aIRecommendation.findMany({
          orderBy: { createdAt: 'desc' },
          take: 4,
        }),
      ]);

    // Composite opportunity score = average of top 5 scores
    const top5 = opportunities.slice(0, 5);
    const opportunityScore =
      top5.length > 0
        ? Math.round(top5.reduce((s, o) => s + o.score, 0) / top5.length)
        : 0;

    const today = weatherSnaps[0] || null;
    const weatherSummary = today
      ? {
          today,
          forecast: weatherSnaps,
          elNinoConfidence: today.elNinoConfidence,
        }
      : null;

    return {
      opportunityScore,
      activeOpportunities: opportunities,
      highestImpact: opportunities[0] || null,
      upcomingEvents: events,
      weatherSummary,
      transportAlerts,
      aiRecommendations: aiRecs,
      lastUpdated: new Date().toISOString(),
    };
  }
}
