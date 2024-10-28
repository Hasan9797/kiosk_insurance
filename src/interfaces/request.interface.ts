export interface GetInsuranceIds {
  order_id: string
  anketa_id: string
  polis_id: number
  vendor_id: number
}

export interface TransactionPreparePayCardResponse {
  id: string
  transaction_id: number
  bank_transaction_id: number
  reference_number: number
  amount: number
  merchantId: number
  terminalId: number
}
