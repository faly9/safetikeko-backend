import { Controller, Get } from '@nestjs/common'
import { PayementService } from './payement.service'
import {
  GETPARCLASSE,
  GETPAYEMENT,
  GETTOTALMONTANT,
} from 'src/routes/user.routes'

@Controller('payement')
export class PayementController {
  constructor(private readonly payementService: PayementService) {}
  @Get(GETPAYEMENT)
  Getallpaiement() {
    return this.payementService.findPaiement()
  }

  @Get(GETTOTALMONTANT)
  getTotalMontant() {
    return this.payementService.getTotalMontant()
  }

  @Get(GETPARCLASSE)
  getTotalClasse() {
    return this.payementService.getTotalByClasse()
  }
}
