import {
  Pagination,
  UserBalanceHistoryStatus,
  UserBalanceHistoryStatusOutPut,
  UserRoles,
  UserRolesOutPut,
  UserStatus,
  UserStatusOutPut,
} from '@enums'
import { FilterService, paginationResponse } from '@helpers'
import { BalanceHistory, FindAllUserBalanceHistoryResponse, FindOneUserBalanceHistoryResponse } from '@interfaces'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class BalanceHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any): Promise<FindAllUserBalanceHistoryResponse> {
    const { limit = Pagination.LIMIT, page = Pagination.PAGE, sort, filters } = query

    const parsedSort = sort ? JSON?.parse(sort) : {}

    const parsedFilters = filters ? JSON?.parse(filters) : []

    const userBalancesHistory = await FilterService?.applyFilters(
      'userBalanceHistory',
      parsedFilters,
      parsedSort,
      limit,
      page,
      ['user'],
    )

    const pagination = paginationResponse(userBalancesHistory.length, limit, page)

    const result: BalanceHistory[] = []

    userBalancesHistory.map((history: any) => {
      result.push({
        id: history?.id,
        amount: Number(history?.amount),
        type: {
          int: history?.type,
          string:
            UserBalanceHistoryStatusOutPut[
              UserBalanceHistoryStatus[history?.type] as keyof typeof UserBalanceHistoryStatusOutPut
            ],
        },
        createdAt: history?.createdAt,
        user: {
          id: history?.user?.id,
          name: history?.user?.name,
          login: history?.user?.login,
          code: history?.user?.code,
          role: {
            int: history?.user?.role,
            string: UserRolesOutPut[UserRoles[history?.user?.role] as keyof typeof UserRolesOutPut],
          },
          status: {
            int: history?.user?.status,
            string: UserStatusOutPut[UserStatus[history?.user?.status] as keyof typeof UserStatusOutPut],
          },
          createdAt: history?.user?.createdAt,
        },
      })
    })
    return {
      data: result,
      pagination: pagination,
    }
  }

  async findOne(id: number): Promise<FindOneUserBalanceHistoryResponse> {
    const userBalanceHistory = await this.prisma.userBalanceHistory.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
      include: {
        user: true,
      },
    })

    if (!userBalanceHistory) {
      throw new NotFoundException('Balance Not Found with Given ID!')
    }

    const result = {
      id: userBalanceHistory?.id,
      amount: Number(userBalanceHistory?.amount),
      type: {
        int: userBalanceHistory?.type,
        string:
          UserBalanceHistoryStatusOutPut[
            UserBalanceHistoryStatus[userBalanceHistory?.type] as keyof typeof UserBalanceHistoryStatusOutPut
          ],
      },
      createdAt: userBalanceHistory?.createdAt,
      user: {
        id: userBalanceHistory?.user?.id,
        name: userBalanceHistory?.user?.name,
        login: userBalanceHistory?.user?.login,
        code: userBalanceHistory?.user?.code,
        role: {
          int: userBalanceHistory?.user?.role,
          string: UserRolesOutPut[UserRoles[userBalanceHistory?.user?.role] as keyof typeof UserRolesOutPut],
        },
        status: {
          int: userBalanceHistory?.user?.status,
          string: UserStatusOutPut[UserStatus[userBalanceHistory?.user?.status] as keyof typeof UserStatusOutPut],
        },
        createdAt: userBalanceHistory?.user?.createdAt,
      },
    }

    return {
      data: result,
    }
  }

  async findOneUserBalanceHistory(userId: number): Promise<Omit<FindAllUserBalanceHistoryResponse, 'pagination'>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!user) {
      throw new NotFoundException('User not found with given ID!')
    }

    const userBalanceHistorys = await this.prisma.userBalanceHistory.findMany({
      where: {
        userId: userId,
        deletedAt: {
          equals: null,
        },
      },
      include: {
        user: true,
      },
    })

    const result: BalanceHistory[] = []

    userBalanceHistorys.map((history: any) => {
      result.push({
        id: history?.id,
        amount: Number(history?.amount),
        type: {
          int: history?.type,
          string:
            UserBalanceHistoryStatusOutPut[
              UserBalanceHistoryStatus[history?.type] as keyof typeof UserBalanceHistoryStatusOutPut
            ],
        },
        createdAt: history?.createdAt,
        user: {
          id: history?.user?.id,
          name: history?.user?.name,
          login: history?.user?.login,
          code: history?.user?.code,
          role: {
            int: history?.user?.role,
            string: UserRolesOutPut[UserRoles[history?.user?.role] as keyof typeof UserRolesOutPut],
          },
          status: {
            int: history?.user?.status,
            string: UserStatusOutPut[UserStatus[history?.user?.status] as keyof typeof UserStatusOutPut],
          },
          createdAt: history?.user?.createdAt,
        },
      })
    })

    return {
      data: result,
    }
  }

  async findStaticUserBalanceHistory(userId: number): Promise<Omit<FindAllUserBalanceHistoryResponse, 'pagination'>> {
    const userBalanceHistorys = await this.prisma.userBalanceHistory.findMany({
      where: {
        userId: userId,
        deletedAt: {
          equals: null,
        },
      },
      include: {
        user: true,
      },
    })

    const result: BalanceHistory[] = []

    userBalanceHistorys.map((history: any) => {
      result.push({
        id: history?.id,
        amount: Number(history?.amount),
        type: {
          int: history?.type,
          string:
            UserBalanceHistoryStatusOutPut[
              UserBalanceHistoryStatus[history?.type] as keyof typeof UserBalanceHistoryStatusOutPut
            ],
        },
        createdAt: history?.createdAt,
        user: {
          id: history?.user?.id,
          name: history?.user?.name,
          login: history?.user?.login,
          code: history?.user?.code,
          role: {
            int: history?.user?.role,
            string: UserRolesOutPut[UserRoles[history?.user?.role] as keyof typeof UserRolesOutPut],
          },
          status: {
            int: history?.user?.status,
            string: UserStatusOutPut[UserStatus[history?.user?.status] as keyof typeof UserStatusOutPut],
          },
          createdAt: history?.user?.createdAt,
        },
      })
    })
    return {
      data: result,
    }
  }
}
