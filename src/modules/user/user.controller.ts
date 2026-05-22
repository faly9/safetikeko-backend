import { Controller, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { USER, SIGNIN, CREATE } from '../../routes/user.routes'
import { LoginUserDto } from './dto/login-user.dto'
import { CreateUserDto } from './dto/create-user.Dto'

@Controller(USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(SIGNIN)
  signin(@Body() dto: LoginUserDto) {
    return this.userService.signin(dto.pseudo, dto.password)
  }

  @Post(CREATE)
  create_user(@Body() dto: CreateUserDto) {
    return this.userService.create_user(dto.pseudo, dto.password, dto.role)
  }
}
