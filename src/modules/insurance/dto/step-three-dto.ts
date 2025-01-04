import { StepThreeRequest } from '@interfaces'
import { IsBooleanString, IsNotEmpty, IsNumber } from 'class-validator'

export class StepThreeDTO implements StepThreeRequest {
  @IsNotEmpty()
  @IsNumber()
  company_id: number

  @IsNotEmpty()
  @IsNumber()
  service_id: number

  @IsNotEmpty()
  @IsBooleanString()
  driverNumberRestriction: string

  step: number
}
