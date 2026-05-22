import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User, Role } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signin(pseudo: string, password: string) {
    const user: User | null = await this.prisma.user.findUnique({
      where: { pseudo },
    })

    if (!user) {
      throw new UnauthorizedException('Pseudo incorrect')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new UnauthorizedException('Mot de passe incorrect')
    }

    const payload = {
      sub: user.id_user,
      pseudo: user.pseudo,
      role: user.role,
    }

    const token = this.jwt.sign(payload)

    return {
      message: 'Connexion réussie',
      access_token: token,
      user: {
        id: user.id_user,
        pseudo: user.pseudo,
        role: user.role,
      },
    }
  }

  async create_user(pseudo: string, password: string, role: Role) {
    const hashedPass = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        pseudo,
        password: hashedPass,
        role,
      },
    })

    return user
  }
}
