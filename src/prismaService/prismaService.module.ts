import { Module } from '@nestjs/common';
import { PrismaService } from './prismaService.service';

@Module({
  providers: [PrismaService],
   exports: [PrismaService],
})
export class PrismaServiceModule {}
