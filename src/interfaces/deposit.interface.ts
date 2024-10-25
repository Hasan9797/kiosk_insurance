export interface CreateDepositRequest {
  operatorId: number
}

interface DepositStatus {
  int: number
  string: string
}

interface Deposit {
  id: number
  amount: number
  status: DepositStatus
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

export interface FindOneDepositResponse {
  data: Deposit
}
