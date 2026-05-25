import { Injectable } from '@nestjs/common'
import { PrismaService } from './../../database/prisma.service'

@Injectable()
export class VagueService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vague.findMany()
  }
}
