// table.service.ts
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

  async getTableALL() {
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
  async getTable(filters?: {
    niveau_id?: number
    filiere_id?: number
    classe_id?: number
  }) {
    return this.prisma.table.findMany({
      where: {
        classe: {
          ...(filters?.niveau_id && { niveau_id: filters.niveau_id }),
          ...(filters?.filiere_id && { filiere_id: filters.filiere_id }),
          ...(filters?.classe_id && { id_classe: filters.classe_id }),
        },
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
      orderBy: [
        { classe: { niveau: { nom: 'asc' } } },
        { classe: { filiere: { nom: 'asc' } } },
        { num_table: 'asc' },
      ],
    })
  }

  async assignOneEtudiantToTable(id_etudiant: number, tableId: number) {
    const table = await this.prisma.table.findUnique({
      where: { id_table: tableId },
      include: { etudiants: true },
    })

    if (!table) throw new Error('Table introuvable')

    if (table.etudiants.length >= table.capacite) {
      throw new Error('Table pleine')
    }

    const etudiant = await this.prisma.etudiant.findFirst({
      where: { id_etudiant },
    })

    if (!etudiant) throw new Error('Étudiant non trouvé')

    await this.prisma.etudiant.update({
      where: { id_etudiant: etudiant.id_etudiant },
      data: { table_id: tableId },
    })

    return { message: 'Étudiant assigné à la table avec succès' }
  }

  async getTablesByClasse(classeId: number) {
    return this.prisma.table.findMany({
      where: { classe_id: classeId },
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

  async getTableStats(filters?: {
    niveau_id?: number
    filiere_id?: number
    classe_id?: number
  }) {
    const tables = (await this.getTable(filters)).sort(
      (a, b) => a.id_table - b.id_table, // ordre croissant 1 → n
    )

    const total = tables.length

    const totalEtudiants = tables.reduce(
      (acc, t) => acc + t.etudiants.length,
      0,
    )

    const tablesFull = tables.filter(
      (t) => t.etudiants.length >= t.capacite,
    ).length

    const tablesDisponibles = tables.filter(
      (t) => t.etudiants.length < t.capacite,
    ).length

    const tablesVides = tables.filter((t) => t.etudiants.length === 0).length

    return {
      total,
      totalEtudiants,
      tablesFull,
      tablesDisponibles,
      tablesVides,
      tables,
    }
  }
}
