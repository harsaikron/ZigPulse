import { Controller, Get } from '@nestjs/common';
import { TransportService } from './transport.service';

@Controller('transport')
export class TransportController {
  constructor(private readonly service: TransportService) {}

  @Get('alerts')
  findAlerts() {
    return this.service.findAlerts();
  }
}
