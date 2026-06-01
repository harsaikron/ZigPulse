import { Module } from '@nestjs/common';
import { CommandCentreController } from './command-centre.controller';
import { CommandCentreService } from './command-centre.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [CommandCentreController],
  providers: [CommandCentreService, PrismaService],
})
export class CommandCentreModule {}
