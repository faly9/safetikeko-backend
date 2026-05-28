import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common'

import { Request } from 'express'

import { ClasseService } from './classe.service'

import { CREATECLASS, GETCLASS, GETMYCLASSE } from 'src/routes/user.routes'

import type { CreateClasseDto } from './dto/create-class.dto'

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'

import { Roles } from 'src/common/decorators/roles.decorator'

import { Role, User } from '@prisma/client'

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

  @Get(GETMYCLASSE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELEGUE)
  findMyClasse(
    @Req()
    req: Request & {
      user: User
    },
  ) {
    return this.classeService.findClasseByDelegue(req.user)
  }
}
