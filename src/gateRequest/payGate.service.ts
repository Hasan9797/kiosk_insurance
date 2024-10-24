import { Injectable } from '@nestjs/common'
import { InfinityRequestService } from './request.service'
import { MethodList } from '@enums'

@Injectable()
export class PayGate extends InfinityRequestService {
  async payByCard(serviceId: string, serviceKey: string, data: any) {
    return this.setServiceId(serviceId)
      .setServiceKey(serviceKey)
      .setMethod(MethodList.PAM_CHECK)
      .setUrl(process.env.PAYMENT_URL)
      .setParams({ vendor_form: data })
      .send()
  }

  async preparePayByCard(serviceId: string, serviceKey: string, data: any) {
    return this.setServiceId(serviceId)
      .setServiceKey(serviceKey)
      .setMethod(MethodList.PAM_PREPARE_PAYMENT)
      .setUrl(process.env.PAYMENT_URL)
      .setParams({ vendor_form: data })
      .send()
  }

  async confirmPayment(serviceId: string, serviceKey: string, data: any) {
    return this.setServiceId(serviceId)
      .setServiceKey(serviceKey)
      .setMethod(MethodList.PAM_CONFIRM_PAYMENT)
      .setUrl(process.env.PAYMENT_URL)
      .setParams({ confirmation_form: data })
      .send()
  }

  async resendSms(serviceId: string, serviceKey: string, data: any) {
    return this.setServiceId(serviceId)
      .setServiceKey(serviceKey)
      .setMethod(MethodList.PAM_CONFIRM_PAYMENT)
      .setUrl(process.env.PAYMENT_URL)
      .setParams({ confirmation_form: data })
      .send()
  }

  async checkTransactionStatus(serviceId: string, serviceKey: string, data: any) {
    return this.setServiceId(serviceId)
      .setServiceKey(serviceKey)
      .setMethod(MethodList.PAM_CONFIRM_PAYMENT)
      .setUrl(process.env.PAYMENT_URL)
      .setParams({ confirmation_form: data })
      .send()
  }

  async getReceipt(serviceId: string, serviceKey: string, data: any) {
    return this.setServiceId(serviceId)
      .setServiceKey(serviceKey)
      .setMethod(MethodList.PAM_CONFIRM_PAYMENT)
      .setUrl(process.env.PAYMENT_URL)
      .setParams({ confirmation_form: data })
      .send()
  }
}
