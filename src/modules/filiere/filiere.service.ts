import { PrismaService } from './../../database/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FiliereService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.filiere.findMany()
  }
  async createFiliere(data: { nom: string }) {
    return this.prisma.filiere.create({
      data: { nom: data.nom },
    })
  }
}
