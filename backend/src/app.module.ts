import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { EventsModule } from './modules/events/events.module';
import { WeatherModule } from './modules/weather/weather.module';
import { TransportModule } from './modules/transport/transport.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OpportunitiesModule,
    EventsModule,
    WeatherModule,
    TransportModule,
  ],
})
export class AppModule {}
