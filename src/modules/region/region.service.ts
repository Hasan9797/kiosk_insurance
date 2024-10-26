import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateRegionRequest,
  FindAllRegionResponse,
  FindOneRegionResponse,
  QueryParams,
  UpdateRegionRequest,
} from '@interfaces'
import { PrismaService } from 'prisma/prisma.service'
import { FilterService } from '@helpers'
import { Pagination } from '@enums'
@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: any): Promise<FindAllRegionResponse> {
    const { limit = Pagination.LIMIT, page = Pagination.PAGE, sort, filters } = query

    const parsedLimit = parseInt(limit, 10)

    const parsedSort = sort ? JSON?.parse(sort) : {}

    const parsedFilters = filters ? JSON?.parse(filters) : []

    const regions = await FilterService?.applyFilters('region', parsedFilters, parsedSort, limit, page)

    const result = []

    for (const region of regions) {
      result?.push({
        id: region?.id,
        name: region?.name,
        status: region?.status || 1,
        createdAt: region?.createdAt,
      })
    }

    return {
      data: result,
    }
  }

  async findOne(id: number): Promise<FindOneRegionResponse> {
    const region = await this.prisma.region.findFirst({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!region) {
      throw new NotFoundException('Region not found with this ID!')
    }

    const result = {
      id: region?.id,
      name: region?.name,
      status: region?.status,
      createdAt: region?.createdAt,
    }

    return {
      data: result,
    }
  }

  async create(data: CreateRegionRequest): Promise<void> {
    const regionExists = await this.prisma.region.findFirst({
      where: {
        name: data?.name,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (regionExists) {
      throw new ConflictException('Region exists with this name!')
    }

    await this.prisma.region.create({
      data: data,
    })
  }

  async update(id: number, data: UpdateRegionRequest): Promise<void> {
    const regionExists = await this.prisma.region.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    const regionNameExists = await this.prisma.region.findFirst({
      where: {
        name: data?.name,
      },
    })

    if (!regionExists) {
      throw new NotFoundException('Region not found with given ID')
    }

    if (regionNameExists) {
      throw new ConflictException('Region exists with this name!')
    }

    await this.prisma.region.update({
      where: {
        id: id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
  }

  async remove(id: number): Promise<void> {
    const regionExists = await this.prisma.region.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!regionExists) {
      throw new NotFoundException('Region not found with given ID')
    }

    await this.prisma.region.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
