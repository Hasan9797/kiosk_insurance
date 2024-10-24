export interface CreateBankRequest {
  name: string
  percentage: number
  regionId: number
}

export interface UpdateBankRequest {
  name?: string
  percentage?: number
  regionId?: number
}
