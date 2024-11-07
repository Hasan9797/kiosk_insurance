import { InsuranceGateService } from 'gateRequest'
import { Injectable } from '@nestjs/common'
import { GetServiceRequest, GetStepRequest, StepFourRequest, StepThreeRequest, StepTwoRequest } from '@interfaces'
import { PrismaService } from 'prisma/prisma.service'
import { InsuranceStatus } from '@enums'
import { StepOneRequest } from '@interfaces'

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

  async getStepOne(data: StepOneRequest, userId: number) {
    const result = await this.insuranceGateService.getStep(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    const insurance = await this.prisma.insurance.create({
      data: {
        request: JSON.stringify(data) || {},
        response: JSON.stringify(result.getResponse()) || {},
        serviceId: data?.service_id,
        companyId: data?.company_id,
        userId: userId,
        status: InsuranceStatus.NEW,
        data: JSON.stringify(result?.getResult()) || {},
      },
    })
    console.log(insurance)
    return result.getResponse()
  }

  async getStepTwo(data: StepTwoRequest, userId: number) {
    const result = await this.insuranceGateService.getStep(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    const existsInsurance = await this.prisma.insurance.findFirst({
      where: {
        status: InsuranceStatus.NEW,
        userId: userId,
      },
    })

    const updateExistsInusrance = await this.prisma.insurance.update({
      where: {
        id: existsInsurance.id,
      },
      data: {
        data: JSON.stringify(result?.getResponse()) || {},
        request: JSON.stringify(data) || {},
        response: JSON.stringify(result.getResponse()) || {},
      },
    })
    console.log(updateExistsInusrance)
    return result.getResponse()
  }

  async getSteThree(data: StepThreeRequest, userId: number) {
    const result = await this.insuranceGateService.getStep(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    const existsInsurance = await this.prisma.insurance.findFirst({
      where: {
        status: InsuranceStatus.NEW,
        userId: userId,
      },
    })

    const updateExistsInusrance = await this.prisma.insurance.update({
      where: {
        id: existsInsurance.id,
      },
      data: {
        data: JSON.stringify(result?.getResponse()) || {},
        request: JSON.stringify(data) || {},
        response: JSON.stringify(result.getResponse()) || {},
      },
    })
    console.log(updateExistsInusrance)
    return result.getResponse()
  }

  async getSteFour(data: StepFourRequest, userId: number) {
    const result = await this.insuranceGateService.getStep(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    const existsInsurance = await this.prisma.insurance.findFirst({
      where: {
        status: InsuranceStatus.NEW,
        userId: userId,
      },
    })

    const updateExistsInusrance = await this.prisma.insurance.update({
      where: {
        id: existsInsurance.id,
      },
      data: {
        data: JSON.stringify(result?.getResponse()) || {},
        request: JSON.stringify(data) || {},
        response: JSON.stringify(result.getResponse()) || {},
      },
    })
    console.log(updateExistsInusrance)
    return result.getResponse()
  }

  async createInsurance(data: any, userId: number) {
    const result = await this.insuranceGateService.createInsurance(
      process.env.QUICKPAY_SERVICE_ID,
      process.env.QUICKPAY_SERVICE_KEY,
      data,
    )

    const { anketa_id, order_id, polis_id, vendor_id } = result?.getInsuranceIds()

    const existsInsurance = await this.prisma.insurance.findFirst({
      where: {
        status: InsuranceStatus.NEW,
        userId: userId,
      },
    })

    const updateExistsInusrance = await this.prisma.insurance.update({
      where: {
        id: existsInsurance.id,
      },
      data: {
        data: JSON.stringify(result?.getResponse()) || {},
        request: JSON.stringify(data) || {},
        response: JSON.stringify(result.getResponse()) || {},
        anketaId: anketa_id,
        orderId: order_id,
        polisId: polis_id,
        vendorId: vendor_id,
        status: InsuranceStatus.PENDING,
      },
    })
    console.log(updateExistsInusrance)
    return result.getResponse()
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
