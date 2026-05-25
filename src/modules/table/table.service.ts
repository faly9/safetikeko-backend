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
}
