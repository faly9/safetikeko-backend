import { Injectable } from '@nestjs/common'
import { PrismaService } from './../../database/prisma.service'

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) {}

  async createTable(data: { num_table: string; classe_id: number }) {
    return this.prisma.table.create({
      data: {
        num_table: data.num_table,
        classe_id: data.classe_id,
      },
    })
  }

  async getTable() {
    return this.prisma.table.findMany({
      include: {
        classe: {
          include: {
            filiere: true,
            niveau: true,
            vague: true,
          },
        },
      },
    })
  }

  // table.service.ts
  async assignOneEtudiantToTable(matricule: string, tableId: number) {
    const table = await this.prisma.table.findUnique({
      where: { id_table: tableId },
      include: { etudiants: true },
    })

    if (!table) throw new Error('Table introuvable')

    if (table.etudiants.length >= table.capacite) {
      throw new Error('Table pleine')
    }

    await this.prisma.etudiant.update({
      where: { matricule },
      data: { table_id: tableId },
    })

    return { message: 'Étudiant assigné à la table avec succès' }
  }

  //Get table by classe
  async getTablesByClasse(classeId: number) {
    return this.prisma.table.findMany({
      where: {
        classe_id: classeId,
      },
      include: {
        classe: {
          include: {
            filiere: true,
            niveau: true,
            vague: true,
          },
        },
        etudiants: true,
      },
    })
  }
}
