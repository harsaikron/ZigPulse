import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TransportService {
  constructor(private prisma: PrismaService) {}

  findAlerts() {
    return this.prisma.transportAlert.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
