import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common'
import { PayService } from './pay.service'
import { ApiTags } from '@nestjs/swagger'
import { CustomRequest } from 'custom'
import { CheckTokenGuard } from 'guards'

@ApiTags('Pay Service')
@Controller({
  version: '1',
})
export class PayController {
  constructor(private readonly payService: PayService) {}

  @UseGuards(CheckTokenGuard)
  @Post('check-pay-card')
  payByCard(@Body() createPayDto: any, @Req() request: CustomRequest) {
    return this.payService.preparePay(createPayDto, request?.user?.id)
  }

  @Post('prepare-pay-card')
  preparePay(@Body() preparePayDto: any) {
    return this.payService.payByCard(preparePayDto)
  }

  @Post('confirm-pay-card')
  confirmPayment(@Body() dto: any) {
    return this.payService.confirmPayment(dto)
  }

  @Post('resend-sms')
  resendSms(@Body() dto: any) {
    return this.payService.resendSms(dto)
  }

  @Post('check-status-transaction')
  checkTransactionStatus(@Body() dto: any) {
    return this.payService.checkTransactionStatus(dto)
  }

  @Post('get-receipt')
  checkReceipt(@Body() dto: any) {
    return this.payService.checkTransactionStatus(dto)
  }

  // @Post('save-every-cash')
  // saveEveryCash(@Body() dto: any) {
  //   return this.payService.confirmPayment(dto)
  // }
}
