import { InsuranceStatus, TransactionStatus } from '@enums'
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
  ) {}

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

    const lastInsurance = await this.prisma.insurance.findFirst({
      where: {
        userId: userId,
        status: InsuranceStatus.NEW,
      },
    })

    const newTransaction = await this.prisma.transaction.create({
      data: {
        userId: userId,
        payerPhone: data?.phone_number,
        request: data,
        response: result?.getResponse(),
        status: TransactionStatus.NEW,
      },
    })

    return result.getResponse()
  }

  async payByCard(data: any, userId: number) {
    const existTransaction = await this.prisma.transaction.findFirst({
      where: {
        userId: userId,
        status: TransactionStatus.NEW,
        deletedAt: {
          equals: null,
        },
      },
    })

    const vendor_form = {
      phone_number: existTransaction?.payerPhone,
      amount: '1000',
      vendor_id: 100080,
    }

    const pay_form = {
      card_number: data?.card_number,
      card_expire: data?.card_expire,
    }

    const result = await this.payGateService.payByCard(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      { vendor_form, pay_form },
    )
    return result.getResponse()
  }

  async confirmPayment(data: any, userId: number) {
    const existTransaction = await this.prisma.transaction.findFirst({
      where: {
        userId: userId,
        status: TransactionStatus.NEW,
        deletedAt: {
          equals: null,
        },
      },
    })

    const confirm_form = {
      confirmation_code: data?.confirmation_code,
      bank_transaction_id: existTransaction?.bankTransactionId,
    }

    const result = await this.payGateService.confirmPayment(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      confirm_form,
    )

    const { id, transaction_id, bank_transaction_id, reference_number, amount, merchantId, terminalId } =
      result?.getIdsPreparePayCard()
    console.log(result?.getIdsPreparePayCard())

    const updatedTransaction = await this.prisma.transaction.update({
      where: {
        id: existTransaction.id,
      },
      data: {
        terminalId: terminalId,
        bankTransactionId: bank_transaction_id,
        amount: amount,
        merchantId: merchantId,
        partnerTransactionId: transaction_id,
        request: data,
        response: result.getResponse(),
        updatedAt: new Date(),
      },
    })
    return result.getResponse()
  }

  async resendSms(userId: number) {
    const existTransaction = await this.prisma.transaction.findFirst({
      where: {
        userId: userId,
        status: TransactionStatus.NEW,
      },
    })

    const data = existTransaction.bankTransactionId

    const result = await this.payGateService.payByCard(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    const { id, transaction_id, bank_transaction_id, reference_number, amount, merchantId, terminalId } =
      result?.getIdsPreparePayCard()
    console.log(result?.getIdsPreparePayCard())

    const updatedTransaction = await this.prisma.transaction.update({
      where: {
        id: existTransaction.id,
      },
      data: {
        terminalId: terminalId,
        bankTransactionId: bank_transaction_id,
        amount: amount,
        merchantId: merchantId,
        partnerTransactionId: transaction_id,
        request: data,
        response: result.getResponse(),
        updatedAt: new Date(),
      },
    })

    return result.getResponse()
  }

  async checkTransactionStatus(userId: number) {
    const existTransaction = await this.prisma.transaction.findFirst({
      where: {
        userId: userId,
        status: TransactionStatus.NEW,
      },
    })

    const data = existTransaction.bankTransactionId

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
      const firebaseToken = user.fcmToken
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

    console.log('salam', user, data)

    const insurance = await this.prisma.insurance.update({
      where: {
        id: userId,
        deletedAt: {
          equals: null,
        },
        status: InsuranceStatus.NEW,
      },
      data: {
        amount: data?.amount,
      },
    })
  }
}
