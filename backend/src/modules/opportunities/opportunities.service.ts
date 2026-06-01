import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where: { dismissed: false },
        orderBy: { score: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.opportunity.count({ where: { dismissed: false } }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    return this.prisma.opportunity.findUnique({ where: { id } });
  }
}
