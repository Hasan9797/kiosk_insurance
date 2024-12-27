import { HttpStatus } from '@enums'
import { formatResponse } from '@helpers'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class CashbackService {
  constructor(private readonly prisma: PrismaService) {}

  async getSetting() {
    const cashbackSettings = await this.prisma.cashbackSettings.findFirst()

    const result = {
      id: cashbackSettings.id,
      percentage: cashbackSettings.percentage,
      enabled: cashbackSettings.enabled,
      createdAt: cashbackSettings.createdAt,
    }

    return formatResponse(HttpStatus.OK, result)
  }

  async updateCashBackStatus(data: any) {
    const cashback = await this.prisma.cashbackSettings.findFirst({
      where: {
        id: 1,
      },
    })

    if (!cashback) {
      throw new NotFoundException('Cashback settings not found!!!')
    }

    await this.prisma.cashbackSettings.update({
      where: {
        id: cashback.id,
      },
      data: {
        updatedAt: new Date(),
        ...data,
      },
    })
    return {
      status: HttpStatus.OK,
    }
  }
}
