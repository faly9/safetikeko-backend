import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common'

import { TableService } from './table.service'
import { CreateTableDto } from './dto/create_table.dto'

import {
  CREATE_TABLE,
  ASSIGN_TABLE,
  GET_TABLE_BY_CLASSE_ID,
  GET_TABLE_STATS,
  GET_TABLE,
} from 'src/routes/user.routes'

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post(CREATE_TABLE)
  async create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.createTable(createTableDto)
  }
  @Get(GET_TABLE)
  async get_tableALL() {
    return this.tableService.getTableALL()
  }

  @Get(GET_TABLE_STATS)
  async getStats(
    @Query('niveau_id') niveauId?: string,
    @Query('filiere_id') filiereId?: string,
    @Query('classe_id') classeId?: string,
  ) {
    return this.tableService.getTableStats({
      niveau_id: niveauId ? parseInt(niveauId) : undefined,
      filiere_id: filiereId ? parseInt(filiereId) : undefined,
      classe_id: classeId ? parseInt(classeId) : undefined,
    })
  }

  @Get(GET_TABLE_BY_CLASSE_ID)
  async getTablesByClasse(@Param('classeId') classeId: string) {
    return this.tableService.getTablesByClasse(Number(classeId))
  }

  @Post(ASSIGN_TABLE)
  async assignTableToEtudiant(
    @Body() body: { id_etudiant: number; tableId: number },
  ) {
    return this.tableService.assignOneEtudiantToTable(
      body.id_etudiant,
      body.tableId,
    )
  }
}
