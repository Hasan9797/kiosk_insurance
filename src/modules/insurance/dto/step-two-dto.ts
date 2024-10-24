import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator'

export class VehicleDataDTO {
  @IsString()
  @IsNotEmpty()
  type: string

  @IsString()
  @IsNotEmpty()
  marka: string

  @IsString()
  @IsNotEmpty()
  vmodel: string

  @IsString()
  @IsNotEmpty()
  texpdate: string

  @IsString()
  @IsNotEmpty()
  year: string

  @IsString()
  @IsNotEmpty()
  dvigatel: string

  @IsString()
  @IsNotEmpty()
  model: string

  @IsString()
  @IsNotEmpty()
  kuzov: string

  @IsString()
  @IsNotEmpty()
  texpsery: string

  @IsString()
  @IsNotEmpty()
  texpnumber: string

  @IsString()
  @IsNotEmpty()
  renumber: string

  @IsString()
  @IsNotEmpty()
  vehicle: string
}

export class StepTwoRequestDTO {
  @IsNumber()
  @IsNotEmpty()
  company_id: number

  @IsNumber()
  @IsNotEmpty()
  service_id: number

  @IsNumber()
  @IsNotEmpty()
  step: number

  @IsString()
  @IsNotEmpty()
  owner_pinfl: string

  @IsNumber()
  @IsNotEmpty()
  owner_fy: number

  @IsNumber()
  @IsNotEmpty()
  use_territory: number

  @IsNumber()
  @IsNotEmpty()
  owner_isdriver: number

  @IsString()
  @IsNotEmpty()
  owner_pasp_sery: string

  @IsString()
  @IsNotEmpty()
  owner_pasp_num: string

  @IsString()
  @IsOptional()
  appl_pasp_sery: string | null

  @IsString()
  @IsOptional()
  appl_pasp_num: string | null

  @IsString()
  @IsOptional()
  appl_fizyur: string | null

  @IsString()
  @IsOptional()
  appl_pinfl: string | null

  @IsNumber()
  @IsNotEmpty()
  driver_limit: number

  @IsNumber()
  @IsNotEmpty()
  period: number

  @IsNumber()
  @IsNotEmpty()
  applicant_isowner: number

  @IsString()
  @IsNotEmpty()
  owner_phone: string

  @IsNumber()
  @IsNotEmpty()
  discount: number

  @IsNotEmpty()
  data: VehicleDataDTO
}
