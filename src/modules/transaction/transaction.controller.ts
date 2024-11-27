import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Transaction Service')
@Controller({
  version: '1',
  path: 'transactions',
})
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: any) {
    return this.transactionService.create(createTransactionDto)
  }

  @Get()
  findAll(@Query() query: any) {
    return this.transactionService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: any) {
    return this.transactionService.update(+id, updateTransactionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id)
  }
}
