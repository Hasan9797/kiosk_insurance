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

export type {
  GetInsuranceIds,
  TransactionPreparePayCardResponse,
  PreparePayCardRequest,
  PrepareToPayRequest,
  ConfirmPaymentRequest,
} from './request.interface'
export type { LoginResponse, LoginRequest, RefreshTokenRequest } from './auth.interface'
export type { JwtModel } from './jwt.interaface'
export type { CreateBankRequest, UpdateBankRequest } from './bank.interface'
export type {
  CreateRegionRequest,
  UpdateRegionRequest,
  FindAllRegionResponse,
  FindOneRegionResponse,
} from './region.interface'

export type {
  CreateStructureRequest,
  UpdateStructureRequest,
  FindAllStructureResponse,
  FindOneStructureResponse,
} from './structure.interface'
export type { CreateUserRequest, FindAllUserResponse, FindOneUserResponse, GetMeResponse } from './user.interface'
export type {
  CreateDepositRequest,
  FindAllDepositResponse,
  FindOneDepositResponse,
  UpdateFcmTokenRequest,
} from './deposit.interface'
export type { QueryParams, Filter, Sort } from './filter.interface'
export type { Changer } from './status.interface'
export type { Pagination } from './pagination.interface'
export type { CreateInsuranceRequest } from './create-insurance.interface'
export type {
  CreatePartnerRequest,
  UpdatePartnerRequest,
  FindAllPartnerResponse,
  FindOnePartnerResponse,
  PartnerModel,
} from './partner.interface'
export type { FindAllUserBalanceResponse, Balance } from './userBalance.interface'
