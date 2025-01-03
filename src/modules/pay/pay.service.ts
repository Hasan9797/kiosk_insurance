import {
  InsuranceStatus,
  NotificationType,
  PaymentStatus,
  TransactionStatus,
  TransactionType,
  notificationTextAfter1900,
  RefundStatus,
  Vendors,
} from '@enums'
import { FirebaseService } from '@helpers'
import { ConfirmPaymentRequest, PrepareToPayRequest, RefundCashRequest } from '@interfaces'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PayGate } from 'gateRequest'
import { PrismaService } from 'prisma/prisma.service'
import { PreparePayCardDTO } from './dto'
import { calculateCashback } from 'helpers/calculate-cashback.helper'

@Injectable()
export class PayService {
  constructor(
    private readonly payGateService: PayGate,
    private readonly prisma: PrismaService,
    private readonly firabase: FirebaseService,
  ) {}

  async preparePay(data: any, userId: number): Promise<void> {
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
      anketa_id: lastInsurance.anketaId,
      amount: '1000',
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
        // payerPhone: data?.phone_number,
        request: JSON.stringify(data),
        response: result?.getResponse(),
        status: TransactionStatus.NEW,
      },
    })

    return result.getResponse()
  }

  async payByCard(data: PreparePayCardDTO, userId: number) {
    const existInsurance = await this.prisma.insurance.findFirst({
      where: {
        userId: userId,
        status: InsuranceStatus.NEW,
        deletedAt: {
          equals: null,
        },
      },
    })

    const vendor_form = {
      phone_number: data.phone_number,
      amount: '1000',
      vendor_id: existInsurance?.vendorId,
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

    await this.prisma.transaction.create({
      data: {
        amount: existInsurance.amount,
        anketaId: existInsurance.anketaId,
        cardExpire: data.card_expire,
        cardNumber: data.card_number,
        insuranceId: existInsurance.id,
        payerPhone: data.phone_number,
        request: JSON.stringify({ vendor_form, pay_form }),
        response: JSON.stringify(result.getResponse()),
        status: TransactionStatus.SUCCESS,
        vendorId: existInsurance.vendorId,
      },
    })
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
    const existInsurance = await this.prisma.insurance.findFirst({
      where: {
        userId: userId,
        status: InsuranceStatus.NEW,
        deletedAt: {
          equals: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          include: {
            structure: true,
          },
        },
      },
    })

    const vendor_form = {
      anketa_id: existInsurance.anketaId,
      amount: 40000,
      vendor_id: existInsurance.vendorId,
    }

    const result = await this.payGateService.payByCash(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      { vendor_form },
    )

    const { amount, transaction_id } = result.getResponse()

    await this.prisma.transaction.create({
      data: {
        amount: amount,
        partnerTransactionId: transaction_id,
        insuranceId: existInsurance.id,
        structureId: existInsurance?.user?.structure?.id,
        request: JSON.stringify(vendor_form),
        response: JSON.stringify(result?.getResponse()),
        paymentType: TransactionType.BY_CASH,
      },
    })

    let status = 0
    const amountInsurance = 40000
    const amountInKiosk = Number(existInsurance.amount)
    let refund = Number(existInsurance.amount) - amountInsurance

    if (refund < 0) {
      refund = RefundStatus.NO
    }

    if (amountInsurance < amountInKiosk) {
      status = RefundStatus.YES
    }

    const response = result.getResponse()
    response.refundStatus = status
    response.refundAmount = refund

    return response
  }

  async saveEveryCash(data: any, userId: number) {
    if (!data.amount || data.amount < 0) {
      throw new BadRequestException('Invalid amount!!!')
    }
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
      orderBy: {
        createdAt: 'desc',
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

    const updatedInsurance = await this.prisma.insurance.findUnique({
      where: {
        id: existingInsurance.id,
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
    }
    let status = 0
    const amountInsurance = 40000
    const amountInKiosk = Number(updatedInsurance.amount)
    console.log('amountInKiosk', amountInKiosk)

    let refund = Number(updatedInsurance.amount) - amountInsurance

    if (refund < 0) {
      refund = 0
    }

    if (amountInsurance < amountInKiosk) {
      status = 1
    }

    return {
      amountInKiosk,
      amountInsurance,
      refund,
      status,
    }
  }

  async refundCash(data: RefundCashRequest, userId: number) {
    const staticAmountInsurance = 40000
    // const cashback = await this.prisma.cashbackSettings.findFirst()
    const existingInsurance = await this.prisma.insurance.findFirst({
      where: {
        status: InsuranceStatus.NEW,
        userId: userId,
        deletedAt: {
          equals: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const existTransaction = await this.prisma.transaction.findFirst({
      where: {
        insuranceId: existingInsurance.id,
        paymentType: TransactionType.BY_CASH,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    const refundAmount = Number(existingInsurance?.amount) - Number(existTransaction?.amount)

    console.log('transaction amount', existingInsurance?.amount)
    console.log('insurance amount', existTransaction?.amount)
    console.log('refund amount', refundAmount)

    if (refundAmount < 500) {
      throw new BadRequestException('Refund Amount Must be more than 500 sum')
    }

    const vendor_form = {
      clientid: data?.phoneNumber,
      amount: '1000',
      vendor_id: Vendors.PAYNET,
    }

    console.log(refundAmount)

    const newTransaction = await this.prisma.transaction.create({
      data: {
        amount: refundAmount,
        status: TransactionStatus.NEW,
        payerPhone: data?.phoneNumber,
        request: JSON.stringify(vendor_form),
        insuranceId: existingInsurance.id,
        userId: userId,
        paymentType: TransactionType.REFUND,
      },
    })

    const transaction_form = {
      partner_transaction_id: newTransaction.id,
    }

    const result = await this.payGateService.payByCash(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      { vendor_form, transaction_form },
    )

    // if (cashback.enabled === true) {
    //   this.cashBackPaynet(userId, data?.phoneNumber)
    // }

    return result.getResponse()
  }

  // async cashBackPaynet(userId: number, phoneNumber: string) {
  //   const cashBackSettings = await this.prisma.cashbackSettings.findFirst()
  //   const existingInsurance = await this.prisma.insurance.findFirst({
  //     where: {
  //       status: InsuranceStatus.NEW,
  //       userId: userId,
  //       deletedAt: {
  //         equals: null,
  //       },
  //     },
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   })

  //   const existTransaction = await this.prisma.transaction.findFirst({
  //     where: {
  //       insuranceId: existingInsurance.id,
  //       userId: userId,
  //     },
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   })
  //   const cashback = calculateCashback(Number(existTransaction.amount), cashBackSettings.percentage)

  //   const vendor_form = {
  //     clientid: phoneNumber,
  //     amount: '1000',
  //     vendor_id: Vendors.PAYNET,
  //   }

  //   const newTransaction = await this.prisma.transaction.create({
  //     data: {
  //       amount: cashback,
  //       status: TransactionStatus.NEW,
  //       payerPhone: phoneNumber,
  //       request: JSON.stringify(vendor_form),
  //       insuranceId: existingInsurance.id,
  //       userId: userId,
  //       paymentType: TransactionType.REFUND,
  //     },
  //   })

  //   const transaction_form = {
  //     partner_transaction_id: newTransaction.id,
  //   }

  //   const result = await this.payGateService.payByCash(
  //     process.env.QUICKPAY_SERVICE_ID,
  //     process.env.QUICKPAY_SERVICE_KEY,
  //     { vendor_form, transaction_form },
  //   )

  //   return result.getResponse()
  // }
}
