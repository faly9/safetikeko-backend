import { Controller, Get } from '@nestjs/common'
import { VagueService } from './vague.service'
import { GETVAGUE } from 'src/routes/user.routes'

@Controller('vague')
export class VagueController {
  constructor(private readonly vagueService: VagueService) {}

  @Get(GETVAGUE)
  findAll() {
    return this.vagueService.findAll()
  }
}
