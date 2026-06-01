import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'
import { User, Etudiant } from '@prisma/client'
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions'
@Injectable()
export class EtudiantService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const [etudiants, total] = await Promise.all([
      this.prisma.etudiant.findMany({
        include: {
          classe: {
            include: {
              filiere: true,
              niveau: true,
              vague: true,
            },
          },
          table: true,
        },
      }),

      this.prisma.etudiant.count(),
    ])

    return {
      total,
      data: etudiants,
    }
  }

  // Assignation étudiant -> QRCode par délégué connecté
  async assignEtudiantToQrcode(
    user: User,
    id_etudiant: number,
    token: string,
    photoBase64?: string,
  ) {
    // Vérifier rôle
    if (user.role !== 'DELEGUE') {
      throw new ForbiddenException('Seul un délégué peut assigner un QRCode')
    }

    // Classe du délégué
    const classe = await this.prisma.classeUniv.findFirst({
      where: {
        delegue_id: user.id_user,
      },
    })

    if (!classe) {
      throw new NotFoundException('Aucune classe assignée à ce délégué')
    }

    // Recherche étudiant dans SA classe
    const etudiant = await this.prisma.etudiant.findFirst({
      where: {
        id_etudiant,
        classe_id: classe.id_classe,
      },

      include: {
        qrcode: true,
      },
    })

    if (!etudiant) {
      throw new NotFoundException('Etudiant introuvable dans votre classe')
    }

    // Vérifier si étudiant possède déjà un QRCode
    if (etudiant.qrcode) {
      throw new BadRequestException('Cet étudiant possède déjà un QRCode')
    }

    // Recherche QRCode
    const qrcode = await this.prisma.qRCode.findUnique({
      where: {
        token,
      },
    })

    if (!qrcode) {
      throw new NotFoundException('QR Code non trouvé')
    }

    // Vérifier QRCode déjà utilisé
    if (qrcode.etudiant_id) {
      throw new BadRequestException('Ce QRCode est déjà assigné')
    }

    // Update photo si envoyée
    if (photoBase64) {
      await this.prisma.etudiant.update({
        where: {
          id_etudiant: Number(etudiant.id_etudiant),
        },

        data: {
          photo: photoBase64,
        },
      })
    }

    // Assignation QRCode
    const qrAssigned = await this.prisma.qRCode.update({
      where: {
        token,
      },

      data: {
        etudiant_id: Number(etudiant.id_etudiant),
        statut: 'VALIDE',
      },

      include: {
        etudiant: true,
      },
    })

    // explicitly type the result to help TS understand etudiant shape
    const qrResult: {
      token: string
      statut: string
      etudiant: Etudiant | null
    } = qrAssigned

    return {
      message: 'QR Code assigné avec succès',

      data: {
        token: qrAssigned.token,
        statut: qrAssigned.statut,

        etudiant: qrResult.etudiant
          ? {
              id_etudiant: qrResult.etudiant.id_etudiant,
              matricule: qrResult.etudiant.matricule,
              nom: qrResult.etudiant.nom,
              prenom: qrResult.etudiant.prenom,
              photo: qrResult.etudiant.photo,
            }
          : null,
      },
    }
  }
}
