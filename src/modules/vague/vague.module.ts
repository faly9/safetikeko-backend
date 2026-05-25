import { Module } from '@nestjs/common'
import { VagueService } from './vague.service'
import { VagueController } from './vague.controller'
import { PrismaService } from 'src/database/prisma.service'

@Module({
  controllers: [VagueController],
  providers: [VagueService, PrismaService],
})
export class VagueModule {}
