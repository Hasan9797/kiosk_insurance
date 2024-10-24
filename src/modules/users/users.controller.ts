import { Body, Controller, Get, Param, Patch, Post, Delete, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDTO, UpdateUserDto } from './dto'

@ApiTags('Users Service')
@Controller({
  path: 'users',
  version: '1',
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.usersService.findAll(query)
  }

  @Get('operators')
  findOperators() {
    return this.usersService.getOperators()
  }

  @Get('incasators')
  findIncasators() {
    return this.usersService.getIncasators()
  }

  @Get('accountant')
  findAccountants() {
    return this.usersService.getAccountans()
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
