import { Controller, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { USER, SIGNIN } from '../../routes/user.routes'
import { LoginUserDto } from './dto/login-user.dto'

@Controller(USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(SIGNIN)
  signin(@Body() dto: LoginUserDto) {
    return this.userService.signin(dto.pseudo, dto.password)
  }
}
