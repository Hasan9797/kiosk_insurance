import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { StructureService } from './structure.service'
import { CreateStructureDTO, UpdateStructureDTO } from './dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Structure Service')
@Controller({
  version: '1',
  path: 'structures',
})
export class StructureController {
  constructor(private readonly structureService: StructureService) { }

  @Get()
  findAll(
    @Query() query: any
  ) {
    return this.structureService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.structureService.findOne(+id)
  }

  @Post()
  create(@Body() createStructureDto: CreateStructureDTO) {
    return this.structureService.create(createStructureDto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStructureDto: UpdateStructureDTO) {
    return this.structureService.update(+id, updateStructureDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.structureService.remove(+id)
  }
}
