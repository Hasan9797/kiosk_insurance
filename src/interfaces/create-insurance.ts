interface Company {
  name: string
  company_id: number
}

export interface GetCompanyResponse {
  jsonrpc: string
  result: Company[]
  id: number
}

export interface GetServiceRequest {
  company_id: number
}

export interface GetStepRequest {
  company_id: number
  service_id: number
}

export interface StepOneRequest {
  company_id: number
  service_id: number
  step: number
  texpsery: string
  texpnumber: string
  renumber: string
}

interface VehicleData {
  type: string
  marka: string
  vmodel: string
  texpdate: string
  year: string
  dvigatel: string
  model: string
  kuzov: string
  texpsery: string
  texpnumber: string
  renumber: string
  vehicle: string
}

export interface StepTwoRequest {
  company_id: number
  service_id: number
  step: number
  owner_pinfl: string
  owner_fy: number
  use_territory: number
  owner_isdriver: number
  owner_pasp_sery: string
  owner_pasp_num: string
  appl_pasp_sery: string | null
  appl_pasp_num: string | null
  appl_fizyur: string | null
  appl_pinfl: string | null
  driver_limit: number
  period: number
  applicant_isowner: number
  owner_phone: string
  discount: number
  data: VehicleData
}

export interface StepThreeData {
  texpdate: string
  year: string
  dvigatel: string
  vehicle: string
  model: string
  kuzov: string
  texpsery: string
  texpnumber: string
  renumber: string
  type: string
  marka: string
  vmodel: string
  appl_name: string | null
  owner_fy: number
  owner_pinfl: string
  owner_oblast: string
  has_benefit: string
  appl_birthdate: string | null
  owner_rayon: string
  owner_surname: string
  owner_name: string
  owner_patronym: string
  appl_surname: string | null
  owner_inn: string
  owner_orgname: string
  owner_pasp_sery: string
  owner_pasp_num: string
  applicant_isowner: number
  owner_phone: string
  owner_isdriver: number
  appl_pasp_num: string | null
  appl_orgname: string | null
  appl_patronym: string | null
  appl_oblast: string | null
  address: string
  prem: number
  appl_inn: string | null
  driver_limit: number
  period: number
  discount: number
  owner_birthdate: string
  appl_rayon: string | null
  use_territory: number
  appl_fizyur: string | null
  appl_pinfl: string | null
  appl_pasp_sery: string | null
}

export interface StepThreeRequest {
  company_id: number
  service_id: number
  old_polis: string | null
  contract_begin: string
  step: number
  is_renewal: number
  opl_type: number
  dog_num: string | null
  dog_date: string | null
  data: StepThreeData
}

export interface StepFourData {
  old_polis: string | null
  contract_begin: string
  dog_num: string | null
  dog_date: string | null
  is_renewal: number
  opl_type: number
}

export interface StepFourRequest {
  company_id: number
  service_id: number
  step: number
  paspsery: string
  paspnumber: string
  pinfl: string
  relative: number
  resident: number
  step_status: number
  data: StepFourData
}
