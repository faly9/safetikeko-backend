// import { Controller, Get, UseGuards } from '@nestjs/common'
import { Get, Controller } from '@nestjs/common'

import { EtudiantService } from './etudiant.service'
import { GETETUDIANT } from 'src/routes/user.routes'
// import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

// @UseGuards(JwtAuthGuard)
@Controller('etudiant')
export class EtudiantController {
  constructor(private readonly etudiantService: EtudiantService) {}

  @Get(GETETUDIANT)
  getAllEtudiant() {
    return this.etudiantService.findAll()
  }
}
