import { InsuranceGateService } from 'gateRequest'
import { Injectable } from '@nestjs/common'
import { GetServiceRequest, GetStepRequest } from '@interfaces'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class InsuranceService {
  constructor(
    private readonly insuranceGateService: InsuranceGateService,
    private readonly prisma: PrismaService,
  ) {}

  async findCompany() {
    const result = await this.insuranceGateService.findCompany(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
    )
    return result.getResponse()
  }

  async findService(data: GetServiceRequest) {
    const result = await this.insuranceGateService.findService(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )
    return result.getResponse()
  }

  async getStep(data: GetStepRequest) {
    const result = await this.insuranceGateService.getStep(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )
    return result.getResponse()
  }

  async createInsurance(data: any) {
    const result = await this.insuranceGateService.createInsurance(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )
    return result.getResponse()

    /*
    id
    anketaId
    status
    polisId
    orderId
    vendorId
    userId
    companyId
    serviceId
    */
  }

  async getPolisUrl(data: any) {
    const result = await this.insuranceGateService.getPolisUrl(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    return result.getResponse()
  }
}
