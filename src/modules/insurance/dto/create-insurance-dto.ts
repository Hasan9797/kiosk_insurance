import { CreateInsuranceRequest } from '@interfaces'
import { IsNotEmpty, IsNumber, IsString, IsOptional, Length } from 'class-validator'

class DriverDto {
  @IsString()
  @IsNotEmpty()
  datebirth: string

  @IsString()
  @IsNotEmpty()
  surname: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  patronym: string

  @IsString()
  @IsNotEmpty()
  @Length(2, 2, { message: 'licsery must be exactly 2 characters' })
  licsery: string

  @IsString()
  @IsNotEmpty()
  @Length(7, 7, { message: 'licnumber must be exactly 7 digits' })
  licnumber: string

  @IsString()
  @IsNotEmpty()
  @Length(14, 14, { message: 'pinfl must be exactly 14 digits' })
  pinfl: string

  @IsNumber()
  @IsNotEmpty()
  relative: number

  @IsNumber()
  @IsNotEmpty()
  resident: number

  @IsString()
  @IsNotEmpty()
  @Length(2, 2, { message: 'paspsery must be exactly 2 characters' })
  paspsery: string

  @IsString()
  @IsNotEmpty()
  @Length(7, 7, { message: 'paspnumber must be exactly 7 digits' })
  paspnumber: string

  @IsString()
  @IsNotEmpty()
  licdate: string
}

class DataDto {
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

  @IsOptional()
  @IsString()
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
  owner_pasp_sery: string

  @IsString()
  @IsNotEmpty()
  @Length(7, 7, { message: 'owner_pasp_num must be exactly 7 digits' })
  owner_pasp_num: string

  @IsNumber()
  @IsNotEmpty()
  applicant_isowner: number

  @IsString()
  @IsNotEmpty()
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
  appl_pinfl: string | null

  @IsOptional()
  @IsString()
  appl_pasp_sery: string | null

  @IsOptional()
  @IsString()
  old_polis: string | null

  @IsString()
  @IsNotEmpty()
  contract_begin: string

  @IsOptional()
  @IsString()
  dog_num: string | null

  @IsOptional()
  @IsString()
  dog_date: string | null

  @IsNumber()
  @IsNotEmpty()
  opl_type: number

  @IsNumber()
  @IsNotEmpty()
  is_renewal: number

  @IsNumber()
  @IsNotEmpty()
  step_status: number

  @IsNotEmpty({ each: true })
  drivers: DriverDto[]
}

export class CreateInsuranceRequestDto implements CreateInsuranceRequest {
  @IsNumber()
  @IsNotEmpty()
  company_id: number

  @IsNumber()
  @IsNotEmpty()
  service_id: number

  @IsNotEmpty()
  data: DataDto
}
