import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CreateBankRequest, UpdateBankRequest } from '@interfaces'
import { FilterService } from '@helpers'
import { Pagination } from 'enums/pagination.enum'
import { Bank } from '@prisma/client'

@Injectable()
export class BankService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: any) {
    const { limit = Pagination.LIMIT, page = Pagination.PAGE, sort, filters } = query

    const parsedSort = sort ? JSON?.parse(sort) : {}

    const parsedFilters = filters ? JSON?.parse(filters) : []

    const banks: Bank[] = await FilterService?.applyFilters('bank', parsedFilters, parsedSort, limit, page)

    return {
      data: banks,
    }
  }

  async findOne(id: number) {
    const bank = await this.prisma.bank.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
    })

    if (!bank) {
      throw new NotFoundException(`Bank not found with given ID`)
    }

    return {
      data: bank,
    }
  }

  async create(data: CreateBankRequest): Promise<void> {
    const regionExists = await this.prisma.region.findUnique({
      where: {
        id: data?.regionId,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!regionExists) {
      throw new NotFoundException('Region not found with given ID!')
    }

    await this.prisma.bank.create({
      data: {
        name: data?.name,
        regionId: data?.regionId,
        percentage: data?.percentage,
      },
    })
  }

  async update(id: number, data: UpdateBankRequest) {
    const bankExists = await this.prisma.bank.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!bankExists) {
      throw new NotFoundException(`Bank not found with given ID`)
    }

    const regionExists = await this.prisma.region.findUnique({
      where: {
        id: data?.regionId,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (data.regionId && !regionExists) {
      throw new NotFoundException('Region not found with given ID!')
    }

    return this.prisma.bank.update({
      where: {
        id: id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
  }

  async remove(id: number) {
    const bankExists = await this.prisma.bank.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!bankExists) {
      throw new NotFoundException(`Bank not found with given ID!`)
    }

    await this.prisma.bank.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
