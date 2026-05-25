import { Injectable } from '@nestjs/common'
import { PrismaService } from './../../database/prisma.service'

@Injectable()
export class NiveauService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.niveau.findMany()
  }
}
