import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'

@Injectable()
export class EtudiantService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const [etudiants, total] = await Promise.all([
      this.prisma.etudiant.findMany({
        include: {
          classe: {
            include: {
              filiere: true,
              niveau: true,
              vague: true,
            },
          },
          table: true,
        },
      }),

      this.prisma.etudiant.count(),
    ])

    return {
      total,
      data: etudiants,
    }
  }
}
