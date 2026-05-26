// scan/scan.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  // UseGuards,
} from '@nestjs/common'
import { ScanService } from './scan.service'
import { CreateScanDto } from './dto/create-scan.dto'
import { SCANQRCODE } from 'src/routes/user.routes'

// import { AuthGuard } from '@nestjs/passport'
// UseGuards(AuthGuard)
@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post(SCANQRCODE)
  @HttpCode(HttpStatus.OK)
  async scanner(@Body() dto: CreateScanDto) {
    return this.scanService.scanQRCode(dto)
  }
}
