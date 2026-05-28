import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { ScanService } from './scan.service'
import { CreateScanDto } from './dto/create-scan.dto'
import { SCANQRCODE, GETHISTOSCAN } from 'src/routes/user.routes'

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

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