import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { EventsModule } from './modules/events/events.module';
import { WeatherModule } from './modules/weather/weather.module';
import { TransportModule } from './modules/transport/transport.module';
import { CommandCentreModule } from './modules/command-centre/command-centre.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OpportunitiesModule,
    EventsModule,
    WeatherModule,
    TransportModule,
    CommandCentreModule,
  ],
})
export class AppModule {}
