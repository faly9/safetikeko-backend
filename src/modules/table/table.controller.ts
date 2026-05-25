import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { TableService } from './table.service'
import { CreateTableDto } from './dto/create_table.dto'
import { CREATE_TABLE, GET_TABLE } from 'src/routes/user.routes'
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
}
