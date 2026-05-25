import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { ClasseService } from './classe.service'
import { CREATECLASS, GETCLASS } from 'src/routes/user.routes'
import type { CreateClasseDto } from './dto/create-class.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('classe')
export class ClasseController {
  constructor(private readonly classeService: ClasseService) {}

  @Get(GETCLASS)
  findAll() {
    return this.classeService.findAll()
  }
  @Post(CREATECLASS)
  createClasse(@Body() body: CreateClasseDto) {
    return this.classeService.createClasse(body)
  }
}
