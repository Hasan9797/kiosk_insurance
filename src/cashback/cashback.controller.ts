import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { CashbackService } from './cashback.service'
import { CheckTokenGuard } from '@guards'
import { Roles } from '@decorators'
import { UserRoles } from '@enums'

@Controller('cashback')
export class CashbackController {
  constructor(private readonly cashbackService: CashbackService) {}

  @UseGuards(CheckTokenGuard)
  @Roles({ role: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.ACCOUNTANT, UserRoles.INCASATOR] })
  @Get()
  async getSettings() {
    return this.cashbackService.getSetting()
  }

  @UseGuards(CheckTokenGuard)
  @Roles({ role: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.ACCOUNTANT, UserRoles.INCASATOR] })
  @Patch('update-cashback-settins')
  async updateSettings(@Body() data: any) {
    return this.cashbackService.updateCashBackStatus(data)
  }
}
