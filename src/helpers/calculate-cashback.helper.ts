import { BadGatewayException } from '@nestjs/common'

export function calculateCashback(amount: number, percentage: number) {
  const cashback = amount * (percentage / 100)

  if (cashback < 500) {
    throw new BadGatewayException('Minimum cash back amount 500 sum!!!')
  }

  return cashback
}
