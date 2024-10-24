export interface CreateDepositRequest {
  operatorId: number
}

interface Deposit {
  id: number
  amount: number
  status: string
  comment: string | null
  checkPhoto: string | null
  type: number
  source: number
  cashCount: number
  operatorId: number
  incasatorId: number
  confirmedId: number
  bankId: number
  createdAt: Date
}

export interface FindAllDepositResponse {
  data: Deposit[]
}
