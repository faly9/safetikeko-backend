import { Module } from '@nestjs/common'
import { NiveauService } from './niveau.service'
import { NiveauController } from './niveau.controller'
import { PrismaService } from 'src/database/prisma.service'

@Module({
  controllers: [NiveauController],
  providers: [NiveauService, PrismaService],
})
export class NiveauModule {}
