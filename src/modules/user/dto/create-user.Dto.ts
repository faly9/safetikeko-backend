import { IsEnum } from 'class-validator'
import { Role } from '@prisma/client'

export class CreateUserDto {
  pseudo!: string
  mot_de_passe!: string

  @IsEnum(Role)
  role!: Role
}
