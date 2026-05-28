import { PrismaService } from './../../database/prisma.service'
import { Injectable } from '@nestjs/common'
import { CreateClasseDto } from './dto/create-class.dto'
import { User } from '@prisma/client'
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

        filiere: {
          connect: { id_filiere: data.id_filiere },
        },

        niveau: {
          connect: { id_niveau: data.id_niveau },
        },

        vague: {
          connect: { id_vague: data.id_vague },
        },

        delegue: {
          connect: { id_user: data.id_delegue },
        },
      },

      include: {
        filiere: true,
        niveau: true,
        vague: true,
        delegue: true,
      },
    })
  }

  // Classe du délégué connecté
  async findClasseByDelegue(user: User) {
    return this.prisma.classeUniv.findMany({
      where: {
        delegue: {
          id_user: user.id_user,
          role: 'DELEGUE',
        },
      },

      select: {
        id_classe: true,
        mode: true,

        delegue: {
          select: {
            id_user: true,
            pseudo: true,
            role: true,
          },
        },

        filiere: {
          select: {
            id_filiere: true,
            nom: true,
          },
        },

        niveau: {
          select: {
            id_niveau: true,
            nom: true,
          },
        },

        vague: {
          select: {
            id_vague: true,
            nom_vague: true,
          },
        },

        tables: {
          select: {
            id_table: true,
            num_table: true,
            capacite: true,
          },
        },

        etudiants: {
          select: {
            matricule: true,
            nom: true,
            prenom: true,
            photo: true,
          },
        },
      },
    })
  }}
