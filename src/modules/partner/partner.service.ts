import { Pagination, PartnerStatus, PartnerStatusOutPut } from '@enums'
import { FilterService, paginationResponse } from '@helpers'
import { CreatePartnerRequest, FindOnePartnerResponse, PartnerModel } from '@interfaces'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Partner } from '@prisma/client'
import { FindAllPartnerResponse } from '@interfaces'
import { PrismaService } from 'prisma/prisma.service'
export { PartnerStatus, PartnerStatusOutPut } from '@enums'

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any): Promise<FindAllPartnerResponse> {
    const { limit = Pagination.LIMIT, page = Pagination.PAGE, sort, filters } = query

    const parsedSort = sort ? JSON?.parse(sort) : {}

    const parsedFilters = filters ? JSON?.parse(filters) : []

    const partners: Partner[] = await FilterService?.applyFilters('partner', parsedFilters, parsedSort, limit, page)

    const pagination = paginationResponse(partners.length, limit, page)

    const result: PartnerModel[] = []

    partners?.map((partner) => {
      result?.push({
        id: partner?.id,
        name: partner?.name,
        partnerId: partner?.partnerId,
        status: {
          int: partner?.status,
          string: PartnerStatusOutPut[PartnerStatus[partner.status] as keyof typeof PartnerStatusOutPut],
        },
        unLimitedAmountTashkent: partner?.unLimitedAmountTashkent,
        limitedAmountTashkent: partner?.limitedAmountTashkent,
        unLimitedAmountInRegion: partner?.unLimitedAmountInRegion,
        limitedAmountInRegion: partner?.limitedAmountInRegion,
        createdAt: partner?.createdAt,
      })
    })

    return {
      data: result,
      pagination: pagination,
    }
  }

  async findOne(id: number): Promise<FindOnePartnerResponse> {
    const partner = await this.prisma.partner.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!partner) {
      throw new NotFoundException('Partner not found with given ID!')
    }

    const result: PartnerModel = {
      id: partner?.id,
      name: partner?.name,
      partnerId: partner?.partnerId,
      status: {
        int: partner?.status,
        string: PartnerStatusOutPut[PartnerStatus[partner.status] as keyof typeof PartnerStatusOutPut],
      },
      unLimitedAmountTashkent: partner?.unLimitedAmountTashkent,
      limitedAmountTashkent: partner?.limitedAmountTashkent,
      unLimitedAmountInRegion: partner?.unLimitedAmountInRegion,
      limitedAmountInRegion: partner?.limitedAmountInRegion,
      createdAt: partner?.createdAt,
    }

    return {
      data: result,
    }
  }

  async create(data: CreatePartnerRequest) {
    const partnerNameExists = await this.prisma.partner.findFirst({
      where: {
        name: data?.name,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (partnerNameExists) {
      throw new ConflictException('This Partner Name Already exists!')
    }
  }

  update(id: number, data: any) {
    return `This action updates a #${id} partner`
  }

  remove(id: number) {
    return `This action removes a #${id} partner`
  }
}
