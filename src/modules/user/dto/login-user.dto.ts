import { IsString } from 'class-validator'

export class LoginUserDto {
  @IsString()
  pseudo!: string

  @IsString()
  mot_de_passe!: string
}
