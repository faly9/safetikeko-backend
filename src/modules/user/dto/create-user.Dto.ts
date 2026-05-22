import { IsEnum } from 'class-validator'
import { Role } from '@prisma/client'

export class CreateUserDto {
  pseudo!: string
  password!: string

  @IsEnum(Role)
  role!: Role
}
