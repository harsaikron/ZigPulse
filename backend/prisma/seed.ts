import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.aIRecommendation.deleteMany();
  await prisma.transportAlert.deleteMany();
  await prisma.weatherSnapshot.deleteMany();
  await prisma.event.deleteMany();
  await prisma.opportunity.deleteMany();

  const now = new Date();
  const days = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

  // 10 Opportunities
  await prisma.opportunity.createMany({
    data: [
      {
        type: 'EVENT',
        title: 'Taylor Swift Eras Tour',
        severity: 'CRITICAL',
        score: 94,
        confidence: 96,
        reasons: ['120,000 expected attendees', 'National Stadium zone', '3 nights consecutive'],
        suggestedCampaign: 'Concert Surge Pricing Alert',
        potentialReach: 45000,
        location: 'National Stadium, Kallang',
        startDate: days(3),
        expiresAt: days(6),
      },
      {
        type: 'EVENT',
        title: 'F1 Singapore Grand Prix',
        severity: 'CRITICAL',
        score: 91,
        confidence: 95,
        reasons: ['Marina Bay circuit closure', '300,000 weekend attendance', 'International visitors surge'],
        suggestedCampaign: 'F1 Weekend Transfer Package',
        potentialReach: 80000,
        location: 'Marina Bay Street Circuit',
        startDate: days(12),
        expiresAt: days(15),
      },
      {
        type: 'WEATHER',
        title: 'Heavy Rain Forecast Tomorrow',
        severity: 'HIGH',
        score: 78,
        confidence: 84,
        reasons: ['88% rain probability', 'CBD and Orchard affected', 'Demand uplift typically +22%'],
        suggestedCampaign: 'Rainy Day Promo Push',
        potentialReach: 28000,
        location: 'CBD, Orchard, Marina Bay',
        startDate: days(1),
        expiresAt: days(2),
      },
      {
        type: 'EVENT',
        title: 'Airport Surge — Long Weekend',
        severity: 'HIGH',
        score: 74,
        confidence: 88,
        reasons: ['Long weekend departure surge', 'T1/T2/T3 congestion expected', '+40% airport transfers'],
        suggestedCampaign: 'Airport Transfer Priority',
        potentialReach: 22000,
        location: 'Changi Airport',
        startDate: days(2),
        expiresAt: days(4),
      },
      {
        type: 'WEATHER',
        title: 'Thunderstorm Alert — CBD',
        severity: 'HIGH',
        score: 76,
        confidence: 79,
        reasons: ['Thunderstorm warning issued', 'Lunchtime peak overlap', 'MRT disruption risk'],
        suggestedCampaign: 'CBD Afternoon Availability Push',
        potentialReach: 18000,
        location: 'Central Business District',
        startDate: days(0),
        expiresAt: days(1),
      },
      {
        type: 'TRANSPORT',
        title: 'EW Line Maintenance Saturday',
        severity: 'HIGH',
        score: 71,
        confidence: 92,
        reasons: ['EW line partial closure 10pm–6am', 'Jurong–Tampines corridor affected', 'No shuttle bus alternative'],
        suggestedCampaign: 'EW Line Night Replacement Service',
        potentialReach: 15000,
        location: 'East–West Line',
        startDate: days(5),
        expiresAt: days(6),
      },
      {
        type: 'HOLIDAY',
        title: 'National Day Long Weekend',
        severity: 'HIGH',
        score: 65,
        confidence: 100,
        reasons: ['3-day weekend', 'Fireworks at Marina Bay', 'Tourism spike expected'],
        suggestedCampaign: 'National Day Explorer Package',
        potentialReach: 35000,
        location: 'Island-wide',
        startDate: days(8),
        expiresAt: days(11),
      },
      {
        type: 'EVENT',
        title: 'Singapore Food Festival',
        severity: 'MEDIUM',
        score: 58,
        confidence: 72,
        reasons: ['10-day festival at Marina Bay', '50,000 expected visitors', 'Evening peak demand'],
        suggestedCampaign: 'Food Festival Night Rides',
        potentialReach: 12000,
        location: 'Marina Bay Sands',
        startDate: days(4),
        expiresAt: days(14),
      },
      {
        type: 'HOLIDAY',
        title: 'School Holidays June',
        severity: 'MEDIUM',
        score: 62,
        confidence: 100,
        reasons: ['4-week school holiday period', 'Family travel increase', 'Zoo/Sentosa demand up'],
        suggestedCampaign: 'Family Day Out Package',
        potentialReach: 20000,
        location: 'Island-wide',
        startDate: days(0),
        expiresAt: days(28),
      },
      {
        type: 'EVENT',
        title: 'IT Show @ Expo',
        severity: 'LOW',
        score: 44,
        confidence: 65,
        reasons: ['Expo convention centre', '15,000 expected visitors', 'MRT Expo station handles most traffic'],
        suggestedCampaign: 'Expo Connector Promo',
        potentialReach: 4000,
        location: 'Singapore Expo, Changi',
        startDate: days(7),
        expiresAt: days(10),
      },
    ],
  });

  // 5 Upcoming Events
  await prisma.event.createMany({
    data: [
      { name: 'Taylor Swift Eras Tour', venue: 'National Stadium', zone: 'Kallang', category: 'Concert', startDate: days(3), attendanceEst: 55000, opportunityScore: 94, source: 'mock' },
      { name: 'F1 Singapore Grand Prix', venue: 'Marina Bay Circuit', zone: 'Marina Bay', category: 'Sports', startDate: days(12), attendanceEst: 100000, opportunityScore: 91, source: 'mock' },
      { name: 'Singapore Food Festival', venue: 'Marina Bay Sands', zone: 'Marina Bay', category: 'Festival', startDate: days(4), attendanceEst: 8000, opportunityScore: 58, source: 'mock' },
      { name: 'IT Show', venue: 'Singapore Expo', zone: 'Changi', category: 'Exhibition', startDate: days(7), attendanceEst: 4000, opportunityScore: 44, source: 'mock' },
      { name: 'National Day Parade', venue: 'The Float @ Marina Bay', zone: 'Marina Bay', category: 'Festival', startDate: days(8), attendanceEst: 25000, opportunityScore: 65, source: 'mock' },
    ],
  });

  // 7-day Weather Snapshots
  const conditions = ['Partly Cloudy', 'Heavy Rain', 'Thunderstorm', 'Sunny', 'Light Rain', 'Cloudy', 'Partly Cloudy'];
  const rainProbs = [45, 88, 92, 20, 65, 55, 40];
  const highs = [32, 29, 28, 34, 30, 31, 33];
  const lows = [26, 25, 24, 27, 25, 26, 26];
  const uplifts = [5, 22, 28, 0, 12, 8, 4];
  for (let i = 0; i < 7; i++) {
    await prisma.weatherSnapshot.create({
      data: {
        date: days(i),
        condition: conditions[i],
        high: highs[i],
        low: lows[i],
        rainProb: rainProbs[i],
        elNinoConfidence: 72,
        demandUplift: uplifts[i],
      },
    });
  }

  // Transport Alerts
  await prisma.transportAlert.createMany({
    data: [
      {
        type: 'MRT_DISRUPTION',
        severity: 'HIGH',
        affectedLine: 'East West Line',
        description: 'Scheduled maintenance between Jurong East and Tampines, Sat 10pm–6am Sun.',
        demandUplift: 18,
        startTime: days(5),
        endTime: days(6),
        source: 'mock',
      },
      {
        type: 'ROAD_CLOSURE',
        severity: 'MEDIUM',
        affectedRoad: 'Raffles Avenue',
        description: 'F1 circuit preparation — Raffles Ave and Marina Blvd closed to traffic.',
        demandUplift: 12,
        startTime: days(10),
        endTime: days(16),
        source: 'mock',
      },
      {
        type: 'MAINTENANCE',
        severity: 'LOW',
        affectedLine: 'Circle Line',
        description: 'Track inspection works between Buona Vista and one-north 2am–5am.',
        demandUplift: 6,
        startTime: days(2),
        endTime: days(2),
        source: 'mock',
      },
    ],
  });

  // AI Recommendations
  await prisma.aIRecommendation.createMany({
    data: [
      { title: 'Launch Taylor Swift Surge Campaign', reason: 'Concert starts in 3 days — push notifications to Kallang-area users now for maximum conversion.', campaignType: 'PUSH_NOTIFICATION' },
      { title: 'Pre-position Fleet for Rain Tomorrow', reason: '88% rain probability tomorrow means +22% demand spike — alert drivers to CBD and Orchard zones.', campaignType: 'DRIVER_ALERT' },
      { title: 'F1 Transfer Package — Book Early CTA', reason: 'F1 weekend in 12 days — early booking incentive can lock in 8,000+ airport transfers.', campaignType: 'EMAIL_CAMPAIGN' },
      { title: 'School Holiday Family Bundle', reason: 'June school holidays ongoing — families travelling to Sentosa, Zoo, Science Centre show 40% higher LTV.', campaignType: 'IN_APP_PROMO' },
    ],
  });

  console.log('✅ Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
