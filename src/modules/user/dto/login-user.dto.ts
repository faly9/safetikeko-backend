import { IsString } from 'class-validator'

export class LoginUserDto {
  @IsString()
  pseudo!: string

  @IsString()
  password!: string
}
