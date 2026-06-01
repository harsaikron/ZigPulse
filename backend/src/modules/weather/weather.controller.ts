import { Controller, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly service: WeatherService) {}

  @Get('current')
  getCurrent() {
    return this.service.getCurrent();
  }
}
