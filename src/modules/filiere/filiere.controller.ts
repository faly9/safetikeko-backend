// import { AuthGuard } from '@nestjs/passport'
import { Controller, Get, UseGuards, Body, Post } from '@nestjs/common'
import { FiliereService } from './filiere.service'
import { CREATEFILIERE, GETFILIERE } from 'src/routes/user.routes'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { CreateFiliereDto } from './dto/create-filiere.dto'

@UseGuards(JwtAuthGuard)
@Controller('filiere')
export class FiliereController {
  constructor(private readonly filiereService: FiliereService) {}
  @Get(GETFILIERE)
  findAll() {
    return this.filiereService.findAll()
  }
  @Post(CREATEFILIERE)
  create(@Body() dto: CreateFiliereDto) {
    return this.filiereService.createFiliere({ nom: dto.nom })
  }
}
