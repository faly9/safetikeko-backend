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
    const user_existe = await this.prisma.user.findUnique({ where: { pseudo } })
    if (user_existe) {
      throw new UnauthorizedException('Ce pseudo est déjà pris')
    }
    const user = await this.prisma.user.create({
      data: {
        pseudo,
        password: hashedPass,
        role,
      },
    })

    return user
  }
  async get_all_users() {
    const users = await this.prisma.user.findMany({
      select: {
        id_user: true,
        pseudo: true,
        role: true,
      },
    })

    return users
  }

  async delete_user(id_user: number) {
    try {
      await this.prisma.user.delete({
        where: { id_user },
      })

      return { message: 'Utilisateur supprimé' }
    } catch {
      return {
        message: 'Utilisateur introuvable ou déjà supprimé',
      }
    }
  }

  async update_user(
    id_user: number,
    pseudo: string,
    password: string,
    role: Role,
  ) {
    const hashedPass = await bcrypt.hash(password, 10)
    const user_existe = await this.prisma.user.findUnique({ where: { pseudo } })
    if (user_existe && user_existe.id_user !== id_user) {
      throw new UnauthorizedException('Ce pseudo est déjà pris')
    }
    const user = await this.prisma.user.update({
      where: { id_user },
      data: {
        pseudo,
        password: hashedPass,
        role,
      },
    })

    return user
  }

  async findDelegues() {
    return this.prisma.user.findMany({
      where: {
        role: 'DELEGUE',
      },
    })
  }
}
