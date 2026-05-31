import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common'

import { TableService } from './table.service'
import { CreateTableDto } from './dto/create_table.dto'

import {
  CREATE_TABLE,
  GET_TABLE,
  ASSIGN_TABLE,
  GET_TABLE_BY_CLASSE_ID,
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
  async get_table() {
    return this.tableService.getTable()
  }

  //  GET tables by classe
  @Get(GET_TABLE_BY_CLASSE_ID)
  async getTablesByClasse(@Param('classeId') classeId: string) {
    return this.tableService.getTablesByClasse(Number(classeId))
  }

  // Assignation automatique des étudiants dans les tables
  @Post(ASSIGN_TABLE)
  async assignTableToEtudiant(
    @Body() body: { matricule: string; tableId: number },
  ) {
    return this.tableService.assignOneEtudiantToTable(
      body.matricule,
      body.tableId,
    )
  }
}
