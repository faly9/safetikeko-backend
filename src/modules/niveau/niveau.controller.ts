import { Controller, Get, UseGuards } from '@nestjs/common'
import { NiveauService } from './niveau.service'
import { GETNIVEAU } from 'src/routes/user.routes'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('niveau')
export class NiveauController {
  constructor(private readonly niveauService: NiveauService) {}

  @Get(GETNIVEAU)
  findAll() {
    return this.niveauService.findAll()
  }
}
