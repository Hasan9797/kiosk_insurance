import { TransactionStatus } from '@enums'
import { FirebaseService } from '@helpers'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PayGate } from 'gateRequest'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class PayService {
  constructor(
    private readonly payGateService: PayGate,
    private readonly prisma: PrismaService,
    private readonly firabase: FirebaseService,
  ) { }

  async preparePay(data: any, userId: number): Promise<void> {
    const result = await this.payGateService.payByCard(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: {
          equals: null,
        },
      },
    })

    const { transaction_id, bank_transaction_id, reference_number, amount, merchantId, terminalId } =
      result.getResult().details

    const newTransaction = await this.prisma.transaction.create({
      data: {
        amount: amount,
        userId: userId,
        bankTransactionId: bank_transaction_id,
        merchantId: merchantId,
        structureId: user.structureId,
        anketaId: data?.anketa_id,
        vendorId: data?.vendor_id,
        payerPhone: data?.phone_number,
        terminalId: terminalId,
        request: data,
        status: TransactionStatus.NEW,
        response: result?.getResponse(),
      },
    })
  }

  async payByCard(data: any) {
    const result = await this.payGateService.payByCard(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      { vendor_form: data, pay_form: { card_number: '8600492948515503', card_expire: '1128' } },
    )
    return result.getResponse()
  }

  async resendSms(data: any) {
    const result = await this.payGateService.payByCard(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )
    return result.getResponse()
  }

  async checkTransactionStatus(data: any) {
    const result = await this.payGateService.payByCard(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )
    return result.getResponse()
  }

  async checkReceipt(data: any) {
    const result = await this.payGateService.payByCard(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )
    return result.getResponse()
  }

  async confirmPayment(data: any) {
    const result = await this.payGateService.confirmPayment(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    return result.getResponse()
  }

  async saveEveryCash(data: any, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: {
          equals: null,
        },
      },
    })

    const cashCountRightNow = user.cashCount

    if (!user) {
      throw new NotFoundException('User not found with given ID!')
    }

    if (cashCountRightNow === 1900 && cashCountRightNow < 1900) {
      const firebaseToken =
        'dMYhX-6vRF2jppve7RJ-c-:APA91bEJsUGVU9zNxgf1JN-RJC1ZBSsI_5A3P2OUTs1h-T82ES5CfXUi7eUga_Ko-PpumQwWMQNM0nwkHC7RbYAGnqT7fDJ4VL74gaDKB7_vYuABTkS7MF1kqi3xkfE-x7AFqq8QytjG'
      if (firebaseToken) {
        await this.firabase.sendPushNotification(firebaseToken, 'Ketdi', 'Naqd pul 1900 dan oshdi')
      }
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        cashCount: cashCountRightNow + 1,
      },
    })

    const insurance = await this.prisma.insurance.update({
      where: {
        id: userId,
        deletedAt: {
          equals: null,
        },
        status: 'created',
      },
      data: {
        amount: data?.amount,
      },
    })
  }
}
