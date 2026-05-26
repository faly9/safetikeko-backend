import { Module } from '@nestjs/common'
import { PayementService } from './payement.service'
import { PayementController } from './payement.controller'
import { PrismaService } from 'src/database/prisma.service'

@Module({
  controllers: [PayementController],
  providers: [PayementService, PrismaService],
})
export class PayementModule {}
