import { PrismaService } from './../../database/prisma.service'
import { Module } from '@nestjs/common'
import { FiliereService } from './filiere.service'
import { FiliereController } from './filiere.controller'

@Module({
  controllers: [FiliereController],
  providers: [FiliereService, PrismaService],
})
export class FiliereModule {}
