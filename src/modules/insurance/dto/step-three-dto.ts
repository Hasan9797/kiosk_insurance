import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator'
import { StepThreeData, StepThreeRequest } from '@interfaces'

class DataDto implements StepThreeData {
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
  vehicle: string

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
  owner_fy: number

  @IsString()
  @IsNotEmpty()
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

  @IsString()
  owner_orgname: string

  @IsString()
  @IsNotEmpty()
  owner_pasp_sery: string

  @IsString()
  @IsNotEmpty()
  owner_pasp_num: string

  @IsNumber()
  applicant_isowner: number

  @IsString()
  @IsNotEmpty()
  owner_phone: string

  @IsNumber()
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
  prem: number

  @IsOptional()
  @IsString()
  appl_inn: string | null

  @IsNumber()
  driver_limit: number

  @IsNumber()
  period: number

  @IsNumber()
  discount: number

  @IsString()
  owner_birthdate: string

  @IsOptional()
  @IsString()
  appl_rayon: string | null

  @IsNumber()
  use_territory: number

  @IsOptional()
  @IsString()
  appl_fizyur: string | null

  @IsOptional()
  @IsString()
  appl_pinfl: string | null

  @IsOptional()
  @IsString()
  appl_pasp_sery: string | null
}

export class StepThreeRequestDto implements StepThreeRequest {
  @IsNumber()
  company_id: number

  @IsNumber()
  service_id: number

  @IsOptional()
  @IsString()
  old_polis: string | null

  @IsString()
  contract_begin: string

  @IsNumber()
  step: number

  @IsNumber()
  is_renewal: number

  @IsNumber()
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
