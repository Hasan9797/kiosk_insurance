import { IsNotEmpty, IsNumber, IsString, IsOptional, Length, Matches } from 'class-validator'

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
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/, { message: 'texpdate must be in the format dd.MM.yyyy' })
  texpdate: string

  @IsString()
  @IsNotEmpty()
  year: string

  @IsString()
  @IsNotEmpty()
  dvigatel: string

  @IsString()
  @IsOptional()
  model: string | null

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

  @IsString()
  @IsNotEmpty()
  @Length(14, 14, { message: 'owner_pinfl must be exactly 14 digits' })
  @Matches(/^[0-9]{14}$/, { message: 'owner_pinfl must contain only numbers' })
  owner_pinfl: string

  // @IsNumber()
  // @IsNotEmpty()
  // @Matches(/^[0-9]$/, { message: 'owner_fy must be a single digit (0 or 1)' })
  // owner_fy: number;

  @IsNumber()
  @IsNotEmpty()
  use_territory: number

  @IsNumber()
  @IsNotEmpty()
  owner_isdriver: number

  @IsString()
  @IsNotEmpty()
  @Length(2, 2, { message: 'owner_pasp_sery must be exactly 2 uppercase letters' })
  @Matches(/^[A-Z]{2}$/, { message: 'owner_pasp_sery must contain only uppercase letters' })
  owner_pasp_sery: string

  @IsString()
  @IsNotEmpty()
  @Length(7, 7, { message: 'owner_pasp_num must be exactly 7 digits' })
  @Matches(/^[0-9]{7}$/, { message: 'owner_pasp_num must contain only numbers' })
  owner_pasp_num: string

  @IsString()
  @IsOptional()
  appl_pasp_sery: string | null

  @IsString()
  @IsOptional()
  @Length(7, 7, { message: 'appl_pasp_num must be exactly 7 digits' })
  @Matches(/^[0-9]{7}$/, { message: 'appl_pasp_num must contain only numbers' })
  appl_pasp_num: string | null

  @IsNumber()
  @IsOptional()
  appl_fizyur: number | null

  @IsString()
  @IsOptional()
  @Length(14, 14, { message: 'appl_pinfl must be exactly 14 digits' })
  @Matches(/^[0-9]{14}$/, { message: 'appl_pinfl must contain only numbers' })
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
  @Length(12, 12, { message: 'owner_phone must be exactly 12 digits starting with 998' })
  @Matches(/^998[0-9]{9}$/, { message: 'owner_phone must start with 998 followed by 9 digits' })
  owner_phone: string

  @IsNumber()
  @IsNotEmpty()
  discount: number

  @IsNotEmpty()
  data: VehicleDataDTO
}
