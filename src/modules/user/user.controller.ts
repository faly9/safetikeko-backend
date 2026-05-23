import { Controller, Post, Body, UseGuards } from '@nestjs/common'

import { UserService } from './user.service'
import { USER, SIGNIN, CREATE } from '../../routes/user.routes'

import { LoginUserDto } from './dto/login-user.dto'
import { CreateUserDto } from './dto/create-user.Dto'

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'

import { Role } from '@prisma/client'

@Controller(USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(SIGNIN)
  signin(@Body() dto: LoginUserDto) {
    return this.userService.signin(dto.pseudo, dto.mot_de_passe)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(CREATE)
  create_user(@Body() dto: CreateUserDto) {
    return this.userService.create_user(dto.pseudo, dto.password, dto.role)
  }
}
