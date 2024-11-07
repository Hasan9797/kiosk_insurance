import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { InsuranceService } from './insurance.service'
import {
  getServiceRequestDTO,
  getStepRequestDTO,
  StepFourRequestDto,
  stepOneRequestDTO,
  StepThreeRequestDto,
  StepTwoRequestDTO,
} from './dto'
import { CheckTokenGuard } from 'guards'
import { CustomRequest } from 'custom'

@ApiTags('Company Service')
@Controller({
  version: '1',
})
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @UseGuards(CheckTokenGuard)
  @Post('get-companies')
  async getCompany() {
    const result = await this.insuranceService.findCompany()
    return result
  }

  @UseGuards(CheckTokenGuard)
  @Post('get-company-services')
  async getServices(@Body() getServiceDto: getServiceRequestDTO) {
    const result = await this.insuranceService.findService(getServiceDto)
    return result
  }

  @UseGuards(CheckTokenGuard)
  @Post('get-step')
  async getStep(@Body() getStepDto: getStepRequestDTO) {
    const result = await this.insuranceService.getStep(getStepDto)
    return result
  }

  @UseGuards(CheckTokenGuard)
  @Post('get-step-one')
  async stepOne(@Body() stepOneDto: stepOneRequestDTO, @Req() request: CustomRequest) {
    const result = await this.insuranceService.getStepOne(stepOneDto, request?.user?.id)
    return result
  }

  @UseGuards(CheckTokenGuard)
  @Post('get-step-two')
  async stepTwo(@Body() stepTwoDto: StepTwoRequestDTO, @Req() request: CustomRequest) {
    const result = await this.insuranceService.getStepTwo(stepTwoDto, request?.user?.id)
    return result
  }

  @UseGuards(CheckTokenGuard)
  @Post('get-step-three')
  async stepThree(@Body() stepThreeDto: StepThreeRequestDto, @Req() request: CustomRequest) {
    const result = await this.insuranceService.getSteThree(stepThreeDto, request?.user?.id)
    return result
  }

  @UseGuards(CheckTokenGuard)
  @Post('get-step-four')
  async stepFour(@Body() stepFourDto: StepFourRequestDto, @Req() request: CustomRequest) {
    const result = await this.insuranceService.getSteFour(stepFourDto, request?.user?.id)
    return result
  }

  @UseGuards(CheckTokenGuard)
  @Post('create-insurance')
  async createInvoice(@Body() createInvoiceDto: any, @Req() request: CustomRequest) {
    const result = await this.insuranceService.createInsurance(createInvoiceDto, request?.user?.id)
    return result
  }

  @UseGuards(CheckTokenGuard)
  @Post('get-polis-url')
  async getPolisUrl(@Body() getPolisUrlDTO: any) {
    const result = await this.insuranceService.getPolisUrl(getPolisUrlDTO)
    return result
  }
}
