// qrcode.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common'

import { Request } from 'express'

import { Role, User } from '@prisma/client'

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'

import { Roles } from 'src/common/decorators/roles.decorator'

import { QrcodeService } from './qrcode.service'

import {
  ASSIGN_QRCODE,
  GENQRCODE,
  GETQRCODE,
  GETETUDIANTBYTOKEN,
} from 'src/routes/user.routes'

import { AssignQrcodeDto } from '../classe/dto/assign-qrcode.dto'

interface RequestWithUser extends Request {
  user: User
}

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Post(GENQRCODE)
  async generate(@Body() body: { quantity: number }) {
    return await this.qrcodeService.generateQRCodes(body.quantity)
  }

  @Get(GETQRCODE)
  async getAll() {
    return await this.qrcodeService.getAllQRCodes()
  }

  @Post(ASSIGN_QRCODE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELEGUE)
  async assignEtudiantToQrcode(
    @Req() req: RequestWithUser,
    @Body() dto: AssignQrcodeDto,
  ) {
    return await this.qrcodeService.assignEtudiantToQrcode(
      req.user,
      dto.id_etudiant,
      dto.token,
      dto.photoBase64,
    )
  }

  @Get(GETETUDIANTBYTOKEN)
  getEtudiant(@Param('token') token: string) {
    return this.qrcodeService.getEtudiantByQr(token)
  }
}
