import { Injectable } from '@nestjs/common'
import { InfinityRequestService } from './request.service'
import { MethodList } from '@enums'
import { GetServiceRequest } from '@interfaces'

@Injectable()
export class InsuranceGateService extends InfinityRequestService {
  async findCompany(serviceId: string, serviceKey: string) {
    return this.setServiceId(serviceId)
      .setServiceKey(serviceKey)
      .setMethod(MethodList.GET_COMPANY)
      .setUrl(process.env.INSURANCE_URL)
      .setParams({})
      .send()
  }

  async findService(data: GetServiceRequest, serviceId: string, serviceKey: string) {
    return this.setServiceId(serviceId)
      .setServiceKey(serviceKey)
      .setMethod(MethodList.GET_SERVICES)
      .setUrl(process.env.INSURANCE_URL)
      .setParams(data)
      .send()
  }

  async getStep(data: any, serviceId: string, serviceKey: string) {
    return this.setServiceId(serviceId)
      .setServiceKey(serviceKey)
      .setMethod(MethodList.GET_STEP)
      .setUrl(process.env.INSURANCE_URL)
      .setParams(data)
      .send()
  }

  async createInsurance(data: any, serviceId: string, serviceKey: string) {
    return this.setServiceId(serviceId)
      .setServiceKey(serviceKey)
      .setMethod(MethodList.CREATE_INSURANCE)
      .setUrl(process.env.INSURANCE_URL)
      .setParams(data)
      .send()
  }
}
