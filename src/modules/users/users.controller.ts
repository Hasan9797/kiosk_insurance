import { Body, Controller, Get, Param, Patch, Post, Delete, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDTO, UpdateUserDto } from './dto'
import { CustomRequest } from 'custom'
import { CheckTokenGuard } from '@guards'

@ApiTags('Users Service')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.usersService.findAll(query)
  }

  @Get('operators')
  findOperators(@Query() query: any) {
    return this.usersService.getOperators(query)
  }

  @Get('incasators')
  findIncasators() {
    return this.usersService.getIncasators()
  }

  @Get('accountant')
  findAccountants() {
    return this.usersService.getAccountans()
  }

  @UseGuards(CheckTokenGuard)
  @Get('operator-static')
  findoperatorsStatic(@Req() request: CustomRequest) {
    return this.usersService.getOperatorsStatic(request?.user?.id)
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id)
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(+id)
  }
}
