import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator'
import { StepFourData, StepFourRequest } from '@interfaces'

class DataDto implements StepFourData {
  @IsOptional()
  @IsString()
  old_polis: string | null

  @IsString()
  contract_begin: string

  @IsOptional()
  @IsString()
  dog_num: string | null

  @IsOptional()
  @IsString()
  dog_date: string | null

  @IsNumber()
  is_renewal: number

  @IsNumber()
  opl_type: number
}

export class StepFourRequestDto implements StepFourRequest {
  @IsNotEmpty()
  @IsNumber()
  company_id: number

  @IsNotEmpty()
  @IsNumber()
  service_id: number

  @IsNotEmpty()
  @IsNumber()
  step: number

  @IsNotEmpty()
  @IsString()
  paspsery: string

  @IsNotEmpty()
  @IsString()
  paspnumber: string

  @IsNotEmpty()
  @IsString()
  pinfl: string

  @IsNotEmpty()
  @IsNumber()
  relative: number

  @IsNotEmpty()
  @IsNumber()
  resident: number

  @IsNotEmpty()
  @IsNumber()
  step_status: number

  @IsNotEmpty()
  @IsNotEmpty()
  data: DataDto
}
