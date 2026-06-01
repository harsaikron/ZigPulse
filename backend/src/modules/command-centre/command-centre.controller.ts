import { Controller, Get } from '@nestjs/common';
import { CommandCentreService } from './command-centre.service';

@Controller('command-centre')
export class CommandCentreController {
  constructor(private readonly service: CommandCentreService) {}

  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }
}
