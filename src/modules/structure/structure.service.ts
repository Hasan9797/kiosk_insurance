import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateStructureRequest,
  FindAllStructureResponse,
  FindOneStructureResponse,
  UpdateStructureRequest,
} from '@interfaces'
import { PrismaService } from 'prisma/prisma.service'
import { FilterService, paginationResponse } from '@helpers'
import { Pagination, StructureEnum, StructureEnumOutPut } from '@enums'
import { Structure, User } from '@prisma/client'

@Injectable()
export class StructureService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any): Promise<FindAllStructureResponse> {
    const { limit = Pagination.LIMIT, page = Pagination.PAGE, sort, filters } = query

    const parsedSort = sort ? JSON?.parse(sort) : {}

    const parsedFilters = filters ? JSON?.parse(filters) : []

    const structures: Structure[] = await FilterService?.applyFilters(
      'structure',
      parsedFilters,
      parsedSort,
      limit,
      page,
    )

    const result: any = []

    structures.map((structure) => {
      result.push({
        id: structure?.id,
        name: structure?.name,
        status: {
          int: structure?.status,
          string: StructureEnumOutPut[StructureEnum[structure.status] as keyof typeof StructureEnumOutPut],
        },
        createdAt: structure?.createdAt,
        regionId: structure?.regionId,
      })
    })

    const pagination = paginationResponse(structures.length, limit, page)

    return {
      data: result,
      pagination,
    }
  }

  async findOne(id: number): Promise<FindOneStructureResponse> {
    const structure = await this.prisma.structure.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!structure) {
      throw new NotFoundException('Structure not found with given ID!')
    }

    const result = {
      id: structure?.id,
      name: structure?.name,
      status: {
        int: structure?.status,
        string: StructureEnumOutPut[StructureEnum[structure.status] as keyof typeof StructureEnumOutPut],
      },
      createdAt: structure?.createdAt,
      regionId: structure?.regionId,
    }

    return {
      data: result,
    }
  }

  async create(data: CreateStructureRequest): Promise<void> {
    const structureNameExists = await this.prisma.structure.findFirst({
      where: {
        name: data?.name,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (structureNameExists) {
      throw new ConflictException('Structure exists with given name!')
    }

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

    await this.prisma.structure.create({
      data: data,
    })
  }

  async update(id: number, data: UpdateStructureRequest): Promise<void> {
    const structureExists = await this.prisma.structure.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    const structureNameExists = await this.prisma.structure.findFirst({
      where: {
        name: data?.name,
      },
    })

    if (!structureExists) {
      throw new NotFoundException('Structure not found with given ID')
    }

    if (data?.name && structureNameExists) {
      throw new ConflictException('Structure exists with this name!')
    }

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

    await this.prisma.structure.update({
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
    const structureExists = await this.prisma.structure.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!structureExists) {
      throw new NotFoundException('Structure not found with given ID')
    }

    await this.prisma.structure.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
