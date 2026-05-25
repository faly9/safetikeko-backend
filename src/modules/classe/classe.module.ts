import { Module } from '@nestjs/common';
import { ClasseService } from './classe.service';
import { ClasseController } from './classe.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [ClasseController],
  providers: [ClasseService, PrismaService],
})
export class ClasseModule {}
