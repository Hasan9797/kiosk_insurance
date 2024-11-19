import { Controller, Get, Param } from '@nestjs/common'
import { ReportService } from './report.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Report Service')
@Controller({
  version: '1',
  path: 'report',
})
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  findAll() {
    return this.reportService.findAll()
  }

  @Get('report-by-region')
  reportByRegion() {
    return this.reportService.reportByRegion()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id)
  }
}
