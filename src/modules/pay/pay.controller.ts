import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common'
import { PayService } from './pay.service'
import { ApiTags } from '@nestjs/swagger'
import { CustomRequest } from 'custom'
import { CheckTokenGuard } from 'guards'
import { PreparePayCardDTO } from './dto'

@ApiTags('Pay Service')
@Controller({
  version: '1',
})
export class PayController {
  constructor(private readonly payService: PayService) {}

  @UseGuards(CheckTokenGuard)
  @Post('check-pay-card')
  payByCard(@Body() createPayDto: PreparePayCardDTO, @Req() request: CustomRequest) {
    return this.payService.preparePay(createPayDto, request?.user?.id)
  }

  @UseGuards(CheckTokenGuard)
  @Post('prepare-pay-card')
  preparePay(@Body() preparePayDto: any, @Req() request: CustomRequest) {
    return this.payService.payByCard(preparePayDto, request?.user?.id)
  }

  @Post('confirm-pay-card')
  confirmPayment(@Body() dto: any, @Req() request: CustomRequest) {
    return this.payService.confirmPayment(dto, request?.user?.id)
  }

  @Post('resend-sms')
  resendSms(@Req() request: CustomRequest) {
    return this.payService.resendSms(request?.user?.id)
  }

  @Post('check-status-transaction')
  checkTransactionStatus(@Req() request: CustomRequest) {
    return this.payService.checkTransactionStatus(request?.user?.id)
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
