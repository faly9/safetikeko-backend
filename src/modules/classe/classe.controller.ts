import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common'
import { Request } from 'express'
import { Role, User } from '@prisma/client'

import { ClasseService } from './classe.service'
import { CREATECLASS, GETCLASS, GETMYCLASSE } from 'src/routes/user.routes'
import type { CreateClasseDto } from './dto/create-class.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from 'src/common/decorators/roles.decorator'

@Controller('classe')
export class ClasseController {
  constructor(private readonly classeService: ClasseService) {}

  // PUBLIC — pas de guard
  @Get(GETCLASS)
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.classeService.findAll()
  }

  @Post(CREATECLASS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createClasse(@Body() body: CreateClasseDto) {
    return this.classeService.createClasse(body)
  }

  @Get(GETMYCLASSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELEGUE)
  findMyClasse(@Req() req: Request & { user: User }) {
    return this.classeService.findClasseByDelegue(req.user)
  }
}
