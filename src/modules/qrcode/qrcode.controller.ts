// qrcode.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common'
import { QrcodeService } from './qrcode.service'
import { GENQRCODE, GETQRCODE } from 'src/routes/user.routes'

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Post(GENQRCODE)
  generate(@Body() body: { quantity: number }) {
    return this.qrcodeService.generateQRCodes(body.quantity)
  }

  @Get(GETQRCODE)
  getAll() {
    return this.qrcodeService.getAllQRCodes()
  }
}
