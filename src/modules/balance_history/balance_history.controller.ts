import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common'
import { BalanceHistoryService } from './balance_history.service'
import { ApiTags } from '@nestjs/swagger'
import { CustomRequest } from 'custom'
import { CheckTokenGuard } from '@guards'

@ApiTags('User Balance History Service')
@Controller({
  path: 'balance-history',
  version: '1',
})
export class BalanceHistoryController {
  constructor(private readonly balanceHistoryService: BalanceHistoryService) {}

  @UseGuards(CheckTokenGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.balanceHistoryService.findAll(query)
  }

  @UseGuards(CheckTokenGuard)
  @Get('one-user/:id')
  oneUserHistory(@Param('id') id: string) {
    return this.balanceHistoryService.findOneUserBalanceHistory(+id)
  }

  @UseGuards(CheckTokenGuard)
  @Get('static-history')
  staticBalanceHistory(@Req() request: CustomRequest) {
    return this.balanceHistoryService.findStaticUserBalanceHistory(request?.user?.id)
  }

  @UseGuards(CheckTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.balanceHistoryService.findOne(+id)
  }
}
