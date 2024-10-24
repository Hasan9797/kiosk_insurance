export type {
  GetCompanyResponse,
  GetServiceRequest,
  GetStepRequest,
  StepOneRequest,
  StepTwoRequest,
  StepFourData,
  StepThreeRequest,
  StepThreeData,
  StepFourRequest,
} from './create-insurance'

export type { GetInsuranceIds } from './request.interface'
export type { LoginResponse, LoginRequest } from './auth.interface'
export type { JwtModel } from './jwt.interaface'
export type { CreateBankRequest, UpdateBankRequest } from './bank.interface'
export type {
  CreateRegionRequest,
  UpdateRegionRequest,
  FindAllRegionResponse,
  FindOneRegionResponse,
} from './region.interface'

export type { CreateStructureRequest, UpdateStructureRequest } from './structure.interface'
export type { CreateUserRequest } from './user.interface'
export type { CreateDepositRequest } from './deposit.interface'
export type { QueryParams } from './filter.interface'
