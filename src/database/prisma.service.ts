import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

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
