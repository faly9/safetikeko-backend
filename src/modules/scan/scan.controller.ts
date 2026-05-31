import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { ScanService } from './scan.service'
import { CreateScanDto } from './dto/create-scan.dto'
import { SCANQRCODE, GETHISTOSCAN } from 'src/routes/user.routes'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { Role } from '@prisma/client'

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENT)
  @Post(SCANQRCODE)
  @HttpCode(HttpStatus.OK)
  async scanner(@Body() dto: CreateScanDto) {
    return this.scanService.scanQRCode(dto)
  }

  @Get(GETHISTOSCAN)
  async getHistorique(@Param('agent_id', ParseIntPipe) agent_id: number) {
    return this.scanService.getHistorique(agent_id)
  }
}
