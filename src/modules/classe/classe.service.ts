// classe.service.ts
import { PrismaService } from './../../database/prisma.service'
import { Injectable } from '@nestjs/common'
import { CreateClasseDto } from './dto/create-class.dto'

@Injectable()
export class ClasseService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.classeUniv.findMany({
      include: {
        filiere: true,
        niveau: true,
        vague: true,
        delegue: true,
      },
    })
  }

  async createClasse(data: CreateClasseDto) {
    return this.prisma.classeUniv.create({
      data: {
        mode: data.mode,
        filiere: { connect: { id_filiere: data.id_filiere } },
        niveau: { connect: { id_niveau: data.id_niveau } },
        vague: { connect: { id_vague: data.id_vague } },
        delegue: { connect: { id_user: data.id_delegue } },
      },
      include: {
        filiere: true,
        niveau: true,
        vague: true,
        delegue: true,
      },
    })
  }
  
}
