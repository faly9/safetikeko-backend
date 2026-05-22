import { Injectable } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const url = process.env.DATABASE_URL

    console.log('DATABASE_URL =>', url) // DEBUG

    const adapter = new PrismaPg({
      connectionString: url as string,
    })

    super({ adapter })
  }
}
