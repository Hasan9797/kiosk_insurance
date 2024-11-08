import { IsNotEmpty, IsNumber, IsString, IsOptional, Length, Matches, Min, Max } from 'class-validator'
import { StepFourData, StepFourRequest } from '@interfaces'

class DataDto implements StepFourData {
  @IsOptional()
  @IsString()
  old_polis: string | null

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/, { message: 'contract_begin must be in the format dd.MM.yyyy' })
  contract_begin: string

  @IsOptional()
  @IsString()
  dog_num: string | null

  @IsOptional()
  @IsString()
  dog_date: string | null

  @IsNumber()
  @IsNotEmpty()
  is_renewal: number

  @IsNumber()
  @IsNotEmpty()
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
  @Length(2, 2, { message: 'paspsery must be exactly 2 uppercase letters' })
  @Matches(/^[A-Z]{2}$/, { message: 'paspsery must contain only uppercase letters' })
  paspsery: string

  @IsNotEmpty()
  @IsString()
  @Length(7, 7, { message: 'paspnumber must be exactly 7 digits' })
  @Matches(/^[0-9]{7}$/, { message: 'paspnumber must contain only numbers' })
  paspnumber: string

  @IsNotEmpty()
  @IsString()
  @Length(14, 14, { message: 'pinfl must be exactly 14 digits' })
  @Matches(/^[0-9]{14}$/, { message: 'pinfl must contain only numbers' })
  pinfl: string

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'relative must be at least 0' })
  @Max(99, { message: 'relative must be at most 99' })
  relative: number

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'resident must be at least 0' })
  @Max(99, { message: 'resident must be at most 99' })
  resident: number

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'step_status must be 0, 1, or 2' })
  @Max(2, { message: 'step_status must be 0, 1, or 2' })
  step_status: number

  @IsNotEmpty()
  data: DataDto
}
