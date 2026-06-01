import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'
import type { User } from '@prisma/client'
import { Request } from 'express'

import { Roles } from 'src/common/decorators/roles.decorator'

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'

import { PayementService } from './payement.service'
import { AssignPayementDto } from './dto/assign-payement.dto'

import {
  ASSIGN_PAYEMENT,
  GETETUDIANTPAYE,
  GETPARCLASSE,
  GETPAYEMENT,
  ADMINCLASSE,
  GETTOTALMONTANT,
  GETETUDIANTPAYEPARCLASSE,
  GETETUDIANTPAYEGLOBAL,
} from 'src/routes/user.routes'

interface RequestWithUser extends Request {
  user: User
}

@Controller('payement')
export class PayementController {
  constructor(private readonly payementService: PayementService) {}

  @Get(GETPAYEMENT)
  getAllPaiement() {
    return this.payementService.findPaiement()
  }

  @Get(GETTOTALMONTANT)
  getTotalMontant() {
    return this.payementService.getTotalMontant()
  }

  @Get(ADMINCLASSE)
  getTotalClasse() {
    return this.payementService.getTotalByClassedashboard()
  }

  @Get(GETPARCLASSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELEGUE)
  getTotalByClasse(@Req() req: RequestWithUser) {
    return this.payementService.getTotalByClasse(req.user.id_user)
  }

  @Get(GETETUDIANTPAYE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELEGUE)
  getEtudiantsPayes() {
    return this.payementService.getEtudiantsPayes()
  }

  @Get(GETETUDIANTPAYEPARCLASSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELEGUE)
  getEtudiantsPayesPerClasse(@Req() req: RequestWithUser) {
    return this.payementService.getEtudiantsPayesPerClasse(req.user.id_user)
  }

  @Post(ASSIGN_PAYEMENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELEGUE)
  assignPaiementToEtudiant(
    @Req() req: RequestWithUser,
    @Body() dto: AssignPayementDto,
  ) {
    return this.payementService.assignPaiementToEtudiant(
      req.user,
      dto.id_etudiant,
      dto.montant,
    )
  }

  @Get(GETETUDIANTPAYEGLOBAL) // nouvelle constante
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PRESIDENT) // PRESIDENT seulement
  getEtudiantsPayesGlobal() {
    return this.payementService.getEtudiantsPayesGlobal()
  }
}
