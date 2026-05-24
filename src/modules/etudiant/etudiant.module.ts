import { Module } from '@nestjs/common'
import { EtudiantService } from './etudiant.service'
import { EtudiantController } from './etudiant.controller'
import { PrismaService } from 'src/database/prisma.service'

@Module({
  controllers: [EtudiantController],
  providers: [EtudiantService, PrismaService],
})
export class EtudiantModule {}
