import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common'
import { PayService } from './pay.service'
import { ApiTags } from '@nestjs/swagger'
import { CustomRequest } from 'custom'
import { CheckTokenGuard } from 'guards'
import { ConfirmPayDTO, PreparePayCardDTO, PrepareToPayDTO } from './dto'

@ApiTags('Pay Service')
@Controller({
  version: '1',
})
export class PayController {
  constructor(private readonly payService: PayService) {}

  @UseGuards(CheckTokenGuard)
  @Post('check-pay-card')
  payByCard(@Body() prepareToPayDto: PrepareToPayDTO, @Req() request: CustomRequest) {
    return this.payService.preparePay(prepareToPayDto, request?.user?.id)
  }

  @UseGuards(CheckTokenGuard)
  @Post('prepare-pay-card')
  preparePay(@Body() preparePayCard: PreparePayCardDTO, @Req() request: CustomRequest) {
    return this.payService.payByCard(preparePayCard, request?.user?.id)
  }

  @UseGuards(CheckTokenGuard)
  @Post('confirm-pay-card')
  confirmPayment(@Body() confirmPayDto: ConfirmPayDTO, @Req() request: CustomRequest) {
    return this.payService.confirmPayment(confirmPayDto, request?.user?.id)
  }

  @UseGuards(CheckTokenGuard)
  @Post('resend-sms')
  resendSms(@Req() request: CustomRequest) {
    return this.payService.resendSms(request?.user?.id)
  }

  @UseGuards(CheckTokenGuard)
  @Post('check-status-transaction')
  checkTransactionStatus(@Req() request: CustomRequest) {
    return this.payService.checkTransactionStatus(request?.user?.id)
  }

  @UseGuards(CheckTokenGuard)
  @Post('pay-by-cash')
  payByCash(@Req() request: CustomRequest) {
    return this.payService.payByCash(request?.user?.id)
  }

  @UseGuards(CheckTokenGuard)
  @Post('get-receipt')
  checkReceipt(@Body() dto: any) {
    return this.payService.checkTransactionStatus(dto)
  }
}
