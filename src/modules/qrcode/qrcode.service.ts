// qrcode.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Role, Status_QRCode, User } from '@prisma/client'
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

  async assignEtudiantToQrcode(
    user: User,
    id_etudiant: number,
    token: string,
    photoBase64?: string,
  ) {
    if (user.role !== Role.DELEGUE) {
      throw new ForbiddenException('Seul un délégué peut assigner un QR Code')
    }

    const classe = await this.prisma.classeUniv.findUnique({
      where: {
        delegue_id: user.id_user,
      },
    })

    if (!classe) {
      throw new NotFoundException('Aucune classe assignée à ce délégué')
    }

    const etudiant = await this.prisma.etudiant.findFirst({
      where: {
        id_etudiant: id_etudiant,
        classe_id: classe.id_classe,
      },
      include: {
        qrcode: true,
      },
    })

    if (!etudiant) {
      throw new NotFoundException('Etudiant introuvable dans votre classe')
    }

    if (etudiant.qrcode) {
      throw new BadRequestException('Cet étudiant possède déjà un QR Code')
    }

    const qrcode = await this.prisma.qRCode.findUnique({
      where: { token },
    })

    if (!qrcode) {
      throw new NotFoundException('QR Code non trouvé')
    }

    if (qrcode.etudiant_id) {
      throw new BadRequestException('Ce QR Code est déjà assigné')
    }

    const qrAssigned = await this.prisma.$transaction(async (tx) => {
      if (photoBase64) {
        await tx.etudiant.update({
          where: {
            id_etudiant: Number(etudiant.id_etudiant),
          },
          data: {
            photo: photoBase64,
          },
        })
      }

      return tx.qRCode.update({
        where: { id_qrcode: qrcode.id_qrcode },
        data: {
          etudiant_id: etudiant.id_etudiant,
          statut: Status_QRCode.VALIDE,
        },
        include: {
          etudiant: true,
        },
      })
    })

    return {
      message: 'QR Code assigné avec succès',
      data: {
        token: qrAssigned.token,
        statut: qrAssigned.statut,
        etudiant: {
          id_etudiant: qrAssigned.etudiant?.id_etudiant,
          nom: qrAssigned.etudiant?.nom,
          prenom: qrAssigned.etudiant?.prenom,
          photo: qrAssigned.etudiant?.photo,
        },
      },
    }
  }

  async getEtudiantByQr(token: string) {
    const qrcode = await this.prisma.qRCode.findUnique({
      where: { token },
      include: {
        etudiant: {
          include: {
            table: true,
          },
        },
      },
    })

    if (!qrcode || !qrcode.etudiant) {
      throw new NotFoundException('Étudiant introuvable')
    }

    const e = qrcode.etudiant

    return {
      id_etudiant: e.id_etudiant,
      matricule: e.matricule,
      nom: e.nom,
      prenom: e.prenom,
      photo: e.photo,
      table: e.table?.id_table,
    }
  }
}
