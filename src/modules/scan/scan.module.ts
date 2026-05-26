import { Module } from '@nestjs/common'
import { ScanService } from './scan.service'
import { ScanController } from './scan.controller'
import { PrismaService } from 'src/database/prisma.service'

@Module({
  controllers: [ScanController],
  providers: [ScanService, PrismaService],
})
export class ScanModule {}
