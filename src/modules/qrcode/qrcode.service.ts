// qrcode.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class QrcodeService {
  constructor(private prisma: PrismaService) {}

  async generateQRCodes(quantity: number) {
    const qrCodes: { token: string }[] = []

    for (let i = 0; i < quantity; i++) {
      qrCodes.push({ token: uuidv4() })
    }

    await this.prisma.qRCode.createMany({ data: qrCodes })

    return { message: `${quantity} QR Codes générés avec succès` }
  }

  async getAllQRCodes() {
    return this.prisma.qRCode.findMany({
      orderBy: { date_creation: 'desc' },
      include: {
        etudiant: true,
      },
    })
  }
}
