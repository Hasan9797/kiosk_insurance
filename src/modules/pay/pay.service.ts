import { InsuranceStatus, NotificationType, TransactionStatus, notificationTextAfter1900 } from '@enums'
import { FirebaseService } from '@helpers'
import { ConfirmPaymentRequest, PrepareToPayRequest } from '@interfaces'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PayGate } from 'gateRequest'
import { PrismaService } from 'prisma/prisma.service'
import { PreparePayCardDTO } from './dto'

@Injectable()
export class PayService {
  constructor(
    private readonly payGateService: PayGate,
    private readonly prisma: PrismaService,
    private readonly firabase: FirebaseService,
  ) {}

  async preparePay(data: PrepareToPayRequest, userId: number): Promise<void> {
    await this.prisma.user.findUnique({
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

    const vendor_form = {
      phone_number: data?.phone_number,
      summa: '1000',
      vendor_id: lastInsurance.vendorId,
    }

    const result = await this.payGateService.prepareToPay(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      { vendor_form },
    )

    await this.prisma.transaction.create({
      data: {
        userId: userId,
        payerPhone: data?.phone_number,
        request: JSON.stringify(data),
        response: result?.getResponse(),
        status: TransactionStatus.NEW,
      },
    })

    return result.getResponse()
  }

  async payByCard(data: PreparePayCardDTO, userId: number) {
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
      vendor_id: existTransaction?.vendorId,
    }

    const pay_form = {
      card_number: data?.card_number,
      card_expire: data?.card_expire,
    }

    const result = await this.payGateService.preparePayByCard(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      { vendor_form, pay_form },
    )
    return result.getResponse()
  }

  async confirmPayment(data: ConfirmPaymentRequest, userId: number) {
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
      { confirm_form },
    )

    const { transaction_id, bank_transaction_id, amount, merchantId, terminalId } = result.getIdsPreparePayCard()

    await this.prisma.transaction.update({
      where: {
        id: existTransaction.id,
      },
      data: {
        terminalId: terminalId,
        bankTransactionId: bank_transaction_id,
        amount: amount,
        merchantId: merchantId,
        partnerTransactionId: transaction_id,
        request: JSON.stringify(data),
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

    const result = await this.payGateService.resendSms(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    const { transaction_id, bank_transaction_id, amount, merchantId, terminalId } = result.getIdsPreparePayCard()

    await this.prisma.transaction.update({
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

    const result = await this.payGateService.checkTransactionStatus(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    return result.getResponse()
  }

  async getFiscalData(data: any) {
    const result = await this.payGateService.getFiscalDetails(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )
    return result.getResponse()
  }

  async payByCash(userId: number) {
    const existTransaction = await this.prisma.transaction.findFirst({
      where: {
        userId: userId,
        status: TransactionStatus.NEW,
      },
    })

    const vendor_form = {
      anketa_id: existTransaction.anketaId,
      amount: '12000',
      vendor_id: existTransaction.vendorId,
    }

    const result = await this.payGateService.getFiscalDetails(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      { vendor_form },
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
      include: {
        insurances: {
          where: {
            userId: userId,
            status: InsuranceStatus.NEW,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException('User not found with given ID!')
    }

    const incasator = await this.prisma.user.findUnique({
      where: {
        id: user.incasatorId,
      },
    })

    const existingInsurance = await this.prisma.insurance.findFirst({
      where: {
        userId: userId,
        status: InsuranceStatus.NEW,
        deletedAt: {
          equals: null,
        },
      },
    })

    await this.prisma.insurance.update({
      where: {
        id: existingInsurance.id,
      },
      data: {
        amount: Number(existingInsurance.amount) + Number(data.amount),
      },
    })

    const cashCountRightNow = user.cashCount

    if (cashCountRightNow >= 1900) {
      const firebaseToken = incasator.fcmToken
      if (firebaseToken) {
        await this.firabase.sendPushNotification(
          firebaseToken,
          NotificationType.WARNING.toString(),
          `Sizga tegishli ${user.code} raqamli KIOSKda kupyuralar soni 1900 dan oshdi`,
        )

        await this.prisma.notify.create({
          data: {
            title: NotificationType.WARNING.toString(),
            type: NotificationType.WARNING,
            content: notificationTextAfter1900.CONTENT.toString(),
            userId: userId,
          },
        })
      }

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          cashCount: cashCountRightNow + 1,
        },
      })
      return
    }
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        cashCount: cashCountRightNow + 1,
      },
    })
  }
}
