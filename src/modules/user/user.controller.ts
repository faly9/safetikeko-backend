import { Controller, Post, Body, UseGuards, Get, Delete } from '@nestjs/common'

import { UserService } from './user.service'
import {
  USER,
  SIGNIN,
  CREATE,
  GETALL_USERS,
  DELETE_USER,
  UPDATE_USER,
  FINDDELEGUE,
} from '../../routes/user.routes'
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
    return this.userService.signin(dto.pseudo, dto.password)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(CREATE)
  create_user(@Body() dto: CreateUserDto) {
    return this.userService.create_user(dto.pseudo, dto.password, dto.role)
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(GETALL_USERS)
  get_all_users() {
    return this.userService.get_all_users()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(DELETE_USER)
  delete_user(@Body('id_user') id_user: number) {
    return this.userService.delete_user(id_user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(UPDATE_USER)
  update_user(
    @Body('id_user') id_user: number,
    @Body('pseudo') pseudo: string,
    @Body('password') password: string,
    @Body('role') role: Role,
  ) {
    return this.userService.update_user(id_user, pseudo, password, role)
  }

  @Get(FINDDELEGUE)
  findDelegues() {
    return this.userService.findDelegues()
  }
}
