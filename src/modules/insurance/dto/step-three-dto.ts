import { IsNotEmpty, IsNumber, IsString, IsOptional, Length, Matches } from 'class-validator'
import { StepThreeData, StepThreeRequest } from '@interfaces'

class DataDto implements StepThreeData {
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
  @IsNotEmpty()
  vehicle: string

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
  type: string

  @IsString()
  @IsNotEmpty()
  marka: string

  @IsString()
  @IsNotEmpty()
  vmodel: string

  @IsOptional()
  @IsString()
  appl_name: string | null

  @IsNumber()
  @IsNotEmpty()
  owner_fy: number

  @IsString()
  @IsNotEmpty()
  @Length(14, 14, { message: 'owner_pinfl must be exactly 14 digits' })
  @Matches(/^[0-9]{14}$/, { message: 'owner_pinfl must contain only numbers' })
  owner_pinfl: string

  @IsString()
  @IsNotEmpty()
  owner_oblast: string

  @IsString()
  @IsNotEmpty()
  has_benefit: string

  @IsOptional()
  @IsString()
  appl_birthdate: string | null

  @IsString()
  @IsNotEmpty()
  owner_rayon: string

  @IsString()
  @IsNotEmpty()
  owner_surname: string

  @IsString()
  @IsNotEmpty()
  owner_name: string

  @IsString()
  @IsNotEmpty()
  owner_patronym: string

  @IsOptional()
  @IsString()
  appl_surname: string | null

  @IsString()
  @IsNotEmpty()
  owner_inn: string

  @IsOptional()
  @IsString()
  owner_orgname: string | null

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
  owner_isdriver: number

  @IsOptional()
  @IsString()
  appl_pasp_num: string | null

  @IsOptional()
  @IsString()
  appl_orgname: string | null

  @IsOptional()
  @IsString()
  appl_patronym: string | null

  @IsOptional()
  @IsString()
  appl_oblast: string | null

  @IsString()
  @IsNotEmpty()
  address: string

  @IsNumber()
  @IsNotEmpty()
  prem: number

  @IsOptional()
  @IsString()
  appl_inn: string | null

  @IsNumber()
  @IsNotEmpty()
  driver_limit: number

  @IsNumber()
  @IsNotEmpty()
  period: number

  @IsNumber()
  @IsNotEmpty()
  discount: number

  @IsString()
  @IsNotEmpty()
  owner_birthdate: string

  @IsOptional()
  @IsString()
  appl_rayon: string | null

  @IsNumber()
  @IsNotEmpty()
  use_territory: number

  @IsOptional()
  @IsString()
  appl_fizyur: string | null

  @IsOptional()
  @IsString()
  @Length(14, 14, { message: 'appl_pinfl must be exactly 14 digits' })
  @Matches(/^[0-9]{14}$/, { message: 'appl_pinfl must contain only numbers' })
  appl_pinfl: string | null

  @IsOptional()
  @IsString()
  appl_pasp_sery: string | null
}

export class StepThreeRequestDto implements StepThreeRequest {
  @IsNumber()
  @IsNotEmpty()
  company_id: number

  @IsNumber()
  @IsNotEmpty()
  service_id: number

  @IsOptional()
  @IsString()
  old_polis: string | null

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/, { message: 'contract_begin must be in the format dd.MM.yyyy' })
  contract_begin: string

  @IsNumber()
  @IsNotEmpty()
  step: number

  @IsNumber()
  @IsNotEmpty()
  is_renewal: number

  @IsNumber()
  @IsNotEmpty()
  opl_type: number

  @IsOptional()
  @IsString()
  dog_num: string | null

  @IsOptional()
  @IsString()
  dog_date: string | null

  @IsNotEmpty()
  data: DataDto
}
