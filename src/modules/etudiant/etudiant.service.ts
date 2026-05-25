import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'

@Injectable()
export class EtudiantService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.etudiant.findMany({
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
    })
  }
}
