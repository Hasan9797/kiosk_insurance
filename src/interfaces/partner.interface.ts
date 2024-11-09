import { Pagination } from '@interfaces'
import { Changer } from '@interfaces'

export interface CreatePartnerRequest {
  name: string
  partnerId: number
  status: number
  unLimitedAmountTashkent: number
  limitedAmountTashkent: number
  unLimitedAmountInRegion: number
  limitedAmountInRegion: number
}

export interface UpdatePartnerRequest {
  name?: string
  partnerId?: number
  image?: string
  status?: number
  unLimitedAmountTashkent?: number
  limitedAmountTashkent?: number
  unLimitedAmountInRegion?: number
  limitedAmountInRegion?: number
}

export interface PartnerModel {
  id: number
  name: string
  partnerId: number
  status: Changer
  unLimitedAmountTashkent: number
  limitedAmountTashkent: number
  unLimitedAmountInRegion: number
  limitedAmountInRegion: number
  createdAt: Date
}

export interface FindAllPartnerResponse {
  data: PartnerModel[]
  pagination: Pagination
}
export interface FindOnePartnerResponse {
  data: PartnerModel
}
