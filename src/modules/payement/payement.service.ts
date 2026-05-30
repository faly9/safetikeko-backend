import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Role, User } from '@prisma/client'

import { PrismaService } from 'src/database/prisma.service'

@Injectable()
export class PayementService {
  constructor(private prisma: PrismaService) {}

  async findPaiement() {
    return this.prisma.paiement.findMany({
      include: {
        etudiant: {
          include: {
            table: true,
          },
        },
        qrcode: true,
        delegue: true,
      },
    })
  }
  async getTotalMontant() {
    const [totalMontant, nombrePaiements] = await Promise.all([
      this.prisma.paiement.aggregate({
        _sum: {
          montant: true,
        },
      }),

      this.prisma.paiement.count(),
    ])

    return {
      total: totalMontant._sum.montant || 0,
      count: nombrePaiements,
      salaire: nombrePaiements * 800,
    }
  }
  async getTotalByClasse() {
    const paiements = await this.prisma.paiement.findMany({
      include: {
        etudiant: {
          include: {
            classe: {
              include: {
                niveau: true,
                filiere: true,
              },
            },
          },
        },
      },
    })

    const result: Record<
      number,
      {
        id_classe: number
        niveau: string
        mode: 'PRESENTIEL' | 'HYBRIDE'
        filiere: string
        total: number
        count: number
      }
    > = {}

    for (const p of paiements) {
      const classe = p.etudiant.classe
      const id = classe.id_classe

      if (!result[id]) {
        result[id] = {
          id_classe: id,
          niveau: classe.niveau?.nom ?? 'N/A',
          mode: classe.mode,
          filiere: classe.filiere?.nom ?? 'N/A',
          total: 0,
          count: 0,
        }
      }

      result[id].total += p.montant
      result[id].count += 1
    }

    return Object.values(result)
  }

  // Asignation d'un paiement à un étudiant après assignation du QR Code
  async assignPaiementToEtudiant(
    user: User,
    matricule: string,
    montant: number,
  ) {
    if (user.role !== Role.DELEGUE) {
      throw new ForbiddenException('Seul un délégué peut assigner un paiement')
    }

    if (!Number.isFinite(montant) || montant <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à 0')
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
        matricule,
        classe_id: classe.id_classe,
      },
      include: {
        qrcode: true,
        paiement: true,
      },
    })

    if (!etudiant) {
      throw new NotFoundException('Etudiant introuvable dans votre classe')
    }

    if (!etudiant.qrcode) {
      throw new BadRequestException(
        'Veuillez assigner un QR Code avant le paiement',
      )
    }

    if (etudiant.paiement) {
      throw new BadRequestException('Cet étudiant possède déjà un paiement')
    }

    const paiement = await this.prisma.paiement.create({
      data: {
        montant,
        etudiant_id: etudiant.matricule,
        qrcode_id: etudiant.qrcode.id_qrcode,
        delegue_id: user.id_user,
      },
      include: {
        etudiant: true,
        qrcode: true,
        delegue: true,
      },
    })

    return {
      message: 'Paiement assigné avec succès',
      data: paiement,
    }
  }

  async getEtudiantsPayes() {
    const paiements = await this.prisma.paiement.findMany({
      include: {
        etudiant: {
          include: {
            classe: {
              include: {
                niveau: true,
                filiere: true,
              },
            },
          },
        },
      },
      orderBy: {
        date_paiement: 'desc',
      },
    })

    return paiements.map((p) => ({
      id_paiement: p.id_paiement,
      matricule: p.etudiant.matricule,
      nom: p.etudiant.nom,
      prenom: p.etudiant.prenom,
      photo: p.etudiant.photo,
      classe: p.etudiant.classe?.id_classe,
      niveau: p.etudiant.classe?.niveau?.nom,
      filiere: p.etudiant.classe?.filiere?.nom,
      montant: p.montant,
      date: p.date_paiement,
    }))
  }
}
