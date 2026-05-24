import { Controller, Get, UseGuards } from '@nestjs/common'
import { EtudiantService } from './etudiant.service'
import { AuthGuard } from '@nestjs/passport'
import { GETETUDIANT } from 'src/routes/user.routes'

@UseGuards(AuthGuard('jwt'))
@Controller('etudiant')
export class EtudiantController {
  constructor(private readonly etudiantService: EtudiantService) {}

  @Get(GETETUDIANT)
  getAllEtudiant() {
    return this.etudiantService.findAll()
  }
}
