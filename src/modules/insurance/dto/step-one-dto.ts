import { StepOneRequest } from '@interfaces'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class stepOneRequestDTO implements StepOneRequest {
  @IsNumber()
  @IsNotEmpty()
  company_id: number

  @IsNumber()
  @IsNotEmpty()
  service_id: number

  @IsString()
  @IsNotEmpty()
  texpsery: string

  @IsNumber()
  @IsNotEmpty()
  step: number

  @IsString()
  @IsNotEmpty()
  texpnumber: string

  @IsString()
  @IsNotEmpty()
  renumber: string
}
