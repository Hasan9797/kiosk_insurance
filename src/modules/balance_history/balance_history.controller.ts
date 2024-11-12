import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common'
import { BalanceHistoryService } from './balance_history.service'
import { ApiTags } from '@nestjs/swagger'
import { CustomRequest } from 'custom'

@ApiTags('User Balance History Service')
@Controller({
  path: 'balance-history',
  version: '1',
})
export class BalanceHistoryController {
  constructor(private readonly balanceHistoryService: BalanceHistoryService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.balanceHistoryService.findAll(query)
  }

  @Get('one-user/:id')
  oneUserHistory(@Param('id') id: string) {
    return this.balanceHistoryService.findOneUserBalanceHistory(+id)
  }

  @Get('static-history')
  staticBalanceHistory(@Req() request: CustomRequest) {
    return this.balanceHistoryService.findStaticUserBalanceHistory(request?.user?.id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.balanceHistoryService.findOne(+id)
  }
}
