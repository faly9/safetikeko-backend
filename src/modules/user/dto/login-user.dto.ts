import { IsString, IsNotEmpty } from 'class-validator'

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  pseudo!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}
