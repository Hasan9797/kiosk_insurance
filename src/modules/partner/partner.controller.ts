import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { PartnerService } from './partner.service'
import { CreatePartnerDTO, UpdatePartnerDTO } from './dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Partner Service')
@Controller({
  version: '1',
  path: 'partners',
})
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.partnerService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.partnerService.findOne(+id)
  }

  @Post()
  create(@Body() data: CreatePartnerDTO) {
    return this.partnerService.create(data)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdatePartnerDTO) {
    return this.partnerService.update(+id, data)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnerService.remove(+id)
  }
}
