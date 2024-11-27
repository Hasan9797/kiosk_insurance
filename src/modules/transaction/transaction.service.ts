import { Pagination } from '@enums'
import { FilterService, paginationResponse } from '@helpers'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const { limit = Pagination.LIMIT, page = Pagination.PAGE, sort, filters } = query

    const parsedSort = sort ? JSON?.parse(sort) : {}

    const parsedFilters = filters ? JSON?.parse(filters) : []

    const transactions: [] = await FilterService?.applyFilters(
      'transaction',
      parsedFilters,
      parsedSort,
      Number(limit),
      Number(page),
    )

    console.log(transactions)

    const pagination = paginationResponse(transactions.length, limit, page)

    return {
      data: transactions,
      pagination: pagination,
    }
  }

  async findOne(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!transaction) {
      throw new NotFoundException('Transaction not found with given ID!')
    }

    return {
      data: transaction,
    }
  }

  create(createTransactionDto: any) {}

  update(id: number, updateTransactionDto: any) {
    return `This action updates a #${id} transaction`
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`
  }
}
