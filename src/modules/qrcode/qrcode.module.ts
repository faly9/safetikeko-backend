import { Module } from '@nestjs/common'
import { QrcodeService } from './qrcode.service'
import { QrcodeController } from './qrcode.controller'
import { PrismaService } from 'src/database/prisma.service'

@Module({
  controllers: [QrcodeController],
  providers: [QrcodeService, PrismaService],
})
export class QrcodeModule {}
