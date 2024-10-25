import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateDepositRequest } from '@interfaces'
import { PrismaService } from 'prisma/prisma.service'
import { DepositStatus, DepositStatusOutPut } from 'enums/deposit.enum'
import { FilterService } from '@helpers'
import { FindAllDepositResponse } from 'interfaces/deposit.interface'
import * as admin from 'firebase-admin'
@Injectable()
export class DepositService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any): Promise<FindAllDepositResponse> {
    const { limit, sort, filters } = query

    const parsedSort = sort ? JSON?.parse(sort) : {}
    const parsedFilters = filters ? JSON?.parse(filters) : []

    const deposits = await FilterService?.applyFilters('deposit', parsedFilters, parsedSort)

    const result = []

    for (const deposit of deposits) {
      // DepositStatus ga qarab DepositStatusOutPut qiymatini aniqlash
      let statusOutPut = ''

      switch (deposit.status) {
        case DepositStatus.STATUS_CREATE:
          statusOutPut = DepositStatusOutPut.STATUS_CREATE
          break
        case DepositStatus.STATUS_WAIT:
          statusOutPut = DepositStatusOutPut.STATUS_WAIT
          break
        case DepositStatus.STATUS_SUCCESS:
          statusOutPut = DepositStatusOutPut.STATUS_SUCCESS
          break
        case DepositStatus.STATUS_ERROR:
          statusOutPut = DepositStatusOutPut.STATUS_ERROR
          break
        default:
          statusOutPut = 'UNKNOWN'
      }

      result.push({
        id: deposit.id,
        amount: Number(deposit.amount),
        status: {
          int: deposit?.status,
          string: statusOutPut,
        },
        comment: deposit.comment,
        checkPhoto: deposit.checkPhoto,
        type: deposit.type,
        source: deposit.source,
        cashCount: deposit.cashCount,
        operatorId: deposit.operatorId,
        incasatorId: deposit.incasatorId,
        confirmedId: deposit.confirmedId,
        bankId: deposit.bankId,
        createdAt: deposit.createdAt,
      })
    }

    return {
      data: result,
    }
  }

  async findOne(id: number) {
    const deposit = await this.prisma.deposit.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!deposit) {
      throw new NotFoundException('Deposit not found with given ID!')
    }

    let statusOutPut = ''

    switch (deposit.status) {
      case DepositStatus.STATUS_CREATE:
        statusOutPut = DepositStatusOutPut.STATUS_CREATE
        break
      case DepositStatus.STATUS_WAIT:
        statusOutPut = DepositStatusOutPut.STATUS_WAIT
        break
      case DepositStatus.STATUS_SUCCESS:
        statusOutPut = DepositStatusOutPut.STATUS_SUCCESS
        break
      case DepositStatus.STATUS_ERROR:
        statusOutPut = DepositStatusOutPut.STATUS_ERROR
        break
      default:
        statusOutPut = 'UNKNOWN'
    }

    const result = {
      id: deposit.id,
      amount: Number(deposit.amount),
      status: {
        int: deposit?.status,
        string: statusOutPut,
      },
      comment: deposit.comment,
      checkPhoto: deposit.checkPhoto,
      type: deposit.type,
      source: deposit.source,
      cashCount: deposit.cashCount,
      operatorId: deposit.operatorId,
      incasatorId: deposit.incasatorId,
      confirmedId: deposit.confirmedId,
      bankId: deposit.bankId,
      createdAt: deposit.createdAt,
    }

    return {
      data: result,
    }
  }

  async findIncasatorStatic(userId: number): Promise<FindAllDepositResponse> {
    const depositStatic = await this.prisma.deposit.findMany({
      where: {
        incasatorId: userId,
        deletedAt: {
          equals: null,
        },
      },
    })

    const result = depositStatic.map((deposit) => {
      // DepositStatus ga qarab DepositStatusOutPut qiymatini aniqlash
      let statusOutPut = ''

      switch (deposit.status) {
        case DepositStatus.STATUS_CREATE:
          statusOutPut = DepositStatusOutPut.STATUS_CREATE
          break
        case DepositStatus.STATUS_WAIT:
          statusOutPut = DepositStatusOutPut.STATUS_WAIT
          break
        case DepositStatus.STATUS_SUCCESS:
          statusOutPut = DepositStatusOutPut.STATUS_SUCCESS
          break
        case DepositStatus.STATUS_ERROR:
          statusOutPut = DepositStatusOutPut.STATUS_ERROR
          break
        default:
          statusOutPut = 'UNKNOWN'
      }

      return {
        id: deposit?.id,
        amount: Number(deposit?.amount),
        status: {
          int: deposit?.status,
          string: statusOutPut,
        },
        comment: deposit?.comment,
        checkPhoto: deposit?.checkPhoto,
        type: deposit?.type,
        source: deposit?.source,
        cashCount: deposit?.cashCount,
        operatorId: deposit?.operatorId,
        incasatorId: deposit?.incasatorId,
        confirmedId: deposit?.confirmedId,
        bankId: deposit?.bankId,
        createdAt: deposit?.createdAt,
      }
    })

    return {
      data: result,
    }
  }

  async create(data: CreateDepositRequest, incasatorId: number) {
    return this.prisma.$transaction(async (prisma) => {
      const opearatorExists = await prisma.user.findUnique({
        where: {
          id: data?.operatorId,
          deletedAt: {
            equals: null,
          },
        },
      })

      if (!opearatorExists) {
        throw new NotFoundException('Operator not found!')
      }

      const cashCount = opearatorExists?.cashCount

      await prisma.user.update({
        where: {
          id: data?.operatorId,
          deletedAt: {
            equals: null,
          },
        },
        data: {
          cashCount: 0,
          updatedAt: new Date(),
        },
      })

      const totalAmountInOperator = await prisma.userBalance.findUnique({
        where: {
          userId: data?.operatorId,
          deletedAt: {
            equals: null,
          },
        },
      })

      const incasatorBalance = await prisma.userBalance.findUnique({
        where: {
          userId: incasatorId,
          deletedAt: {
            equals: null,
          },
        },
      })

      await prisma.userBalance.update({
        where: {
          userId: data?.operatorId,
          deletedAt: {
            equals: null,
          },
        },
        data: {
          balance: 0,
          updatedAt: new Date(),
        },
      })

      const incasatorBalanceUpdated = await prisma.userBalance.update({
        where: {
          userId: incasatorId,
          deletedAt: {
            equals: null,
          },
        },
        data: {
          balance: totalAmountInOperator?.balance + incasatorBalance?.balance,
          updatedAt: new Date(),
        },
      })

      await prisma.deposit.create({
        data: {
          operatorId: data?.operatorId,
          incasatorId: incasatorId,
          amount: incasatorBalanceUpdated?.balance,
          cashCount: cashCount,
          status: DepositStatus.STATUS_CREATE,
        },
      })

      return {
        status: 201,
        message: 'Deposit succesfully created',
        depositStatus: DepositStatusOutPut.STATUS_CREATE,
      }
    })
  }

  async update(id: number, userId: number, data: any, file: Express.Multer.File) {
    const deposit = await this.prisma.deposit.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!deposit) {
      throw new NotFoundException('Deposit not found with given ID!')
    }

    await this.prisma.deposit.update({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
      data: {
        checkPhoto: file?.filename,
        bankId: +data?.bankId,
        comment: data?.comment,
        updatedAt: new Date(),
        status: DepositStatus.STATUS_WAIT,
      },
    })

    await this.prisma.userBalance.update({
      where: {
        userId: userId,
        deletedAt: {
          equals: null,
        },
      },
      data: {
        balance: 0,
        updatedAt: new Date(),
      },
    })
  }

  async updateDepositAccountant(id: number, data: any) {
    const deposit = await this.prisma.deposit.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!deposit) {
      throw new NotFoundException('Deposit not found with given ID!')
    }

    await this.prisma.deposit.update({
      where: {
        id: id,
      },
      data: {
        status: data?.status,
        updatedAt: new Date(),
      },
    })

    return {
      status: 201,
      message: 'succes',
    }
  }

  async sendNotification(data: any) {
    const response = await admin
      .messaging()
      .send({
        token: data?.token,
        webpush: {
          notification: {
            title: data?.title,
            body: data?.body,
          },
        },
      })
      .catch((err) => {
        console.log(err)
        throw new BadRequestException('Someting went wrong')
      })

    return response
  }

  async remove(id: number) {
    const depositExists = await this.prisma.deposit.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!depositExists) {
      throw new NotFoundException('Deposit not found with given ID!')
    }

    await this.prisma.deposit.update({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
