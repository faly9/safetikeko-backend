import { Injectable } from '@nestjs/common'
import { count } from 'console'
import { PrismaService } from 'src/database/prisma.service'

@Injectable()
export class PayementService {
  constructor(private prisma: PrismaService) {}

  async findPaiement() {
    const paiements = await this.prisma.paiement.findMany({
      include: {
        etudiant: true,
        qrcode: true,
        delegue: true,
      },
    })
    return paiements
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
      }
    > = {}

    paiements.forEach((p) => {
      const classe = p.etudiant.classe
      const classeId = classe.id_classe

      if (!result[classeId]) {
        result[classeId] = {
          id_classe: classeId,
          niveau: classe.niveau.nom,
          mode: classe.mode,
          filiere: classe.filiere.nom,
          total: 0,
        }
      }

      result[classeId].total += p.montant
    })

    return Object.values(result)
  }
}
