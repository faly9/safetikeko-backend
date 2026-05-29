import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { Role, User } from '@prisma/client'
import { Request } from 'express'
import { Roles } from 'src/common/decorators/roles.decorator'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { PayementService } from './payement.service'
import {
  ASSIGN_PAYEMENT,
  GETPARCLASSE,
  GETPAYEMENT,
  GETTOTALMONTANT,
  GETETUDIANTPAYE,
} from 'src/routes/user.routes'
import { AssignPayementDto } from './dto/assign-payement.dto'

interface RequestWithUser extends Request {
  user: User
}

@Controller('payement')
export class PayementController {
  constructor(private readonly payementService: PayementService) {}
  @Get(GETPAYEMENT)
  Getallpaiement() {
    return this.payementService.findPaiement()
  }

  @Get(GETTOTALMONTANT)
  getTotalMontant() {
    return this.payementService.getTotalMontant()
  }

  @Get(GETPARCLASSE)
  getTotalClasse() {
    return this.payementService.getTotalByClasse()
  }
  @Get(GETETUDIANTPAYE)
  getEtudiantsPayes() {
    return this.payementService.getEtudiantsPayes()
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
      dto.matricule,
      dto.montant,
    )
  }
}
