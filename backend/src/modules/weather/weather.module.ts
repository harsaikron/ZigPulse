import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, PrismaService],
  exports: [WeatherService],
})
export class WeatherModule {}
