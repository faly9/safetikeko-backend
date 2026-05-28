// scan/scan.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { ResultatScan, Status_QRCode } from '@prisma/client'
import { CreateScanDto } from './dto/create-scan.dto'
import { PrismaService } from 'src/database/prisma.service'

@Injectable()
export class ScanService {
  constructor(private prisma: PrismaService) {}

  async scanQRCode(dto: CreateScanDto) {
    const { token, agent_id } = dto

    const qrcode = await this.prisma.qRCode.findUnique({
      where: { token },
      include: { etudiant: true },
    })

    if (!qrcode) {
      throw new NotFoundException('QR Code introuvable.')
    }

    if (!qrcode.etudiant_id || !qrcode.etudiant) {
      const scan = await this.enregistrerScan(
        qrcode.id_qrcode,
        agent_id,
        ResultatScan.REFUSE,
        'QR Code non assigné à un étudiant.',
      )
      return { succes: false, message: scan.message, scan }
    }

    if (qrcode.statut === Status_QRCode.USED) {
      const scan = await this.enregistrerScan(
        qrcode.id_qrcode,
        agent_id,
        ResultatScan.DEJA_UTILISE,
        'QR Code déjà utilisé. Accès refusé.',
      )
      return { succes: false, message: scan.message, scan }
    }

    if (qrcode.statut !== Status_QRCode.VALIDE) {
      const scan = await this.enregistrerScan(
        qrcode.id_qrcode,
        agent_id,
        ResultatScan.REFUSE,
        `QR Code invalide (statut: ${qrcode.statut}).`,
      )
      return { succes: false, message: scan.message, scan }
    }

    const [scanResult] = await this.prisma.$transaction([
      this.prisma.scan.create({
        data: {
          qrcode_id: qrcode.id_qrcode,
          agent_id,
          resultat: ResultatScan.VALIDE,
          message: `Accès autorisé pour l'étudiant ${qrcode.etudiant.matricule}.`,
        },
      }),
      this.prisma.qRCode.update({
        where: { id_qrcode: qrcode.id_qrcode },
        data: { statut: Status_QRCode.USED },
      }),
    ])

    return {
      succes: true,
      message: scanResult.message,
      etudiant: qrcode.etudiant,
      scan: scanResult,
    }
  }

  private async enregistrerScan(
    qrcode_id: number,
    agent_id: number,
    resultat: ResultatScan,
    message: string,
  ) {
    return this.prisma.scan.create({
      data: { qrcode_id, agent_id, resultat, message },
    })
  }

  async getHistorique(agent_id: number) {
    const scans = await this.prisma.scan.findMany({
      where: { agent_id },
      orderBy: { date_scan: 'desc' },
      include: {
        qrcode: {
          include: {
            etudiant: {
              include: {
                classe: {
                  include: {
                    niveau: true, // ← FK niveau
                    filiere: true, // ← FK filiere
                  },
                },
              },
            },
          },
        },
      },
    })

    return scans.map((scan) => ({
      id_scan: scan.id_scan,
      date_scan: scan.date_scan,
      resultat: scan.resultat,
      message: scan.message,
      etudiant: scan.qrcode.etudiant
        ? {
            matricule: scan.qrcode.etudiant.matricule,
            nom: scan.qrcode.etudiant.nom,
            prenom: scan.qrcode.etudiant.prenom,
            niveau: scan.qrcode.etudiant.classe.niveau.nom,
            filiere: scan.qrcode.etudiant.classe.filiere.nom,
          }
        : null,
    }))
  }
}
