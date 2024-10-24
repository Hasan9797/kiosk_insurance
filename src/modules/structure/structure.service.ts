import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateStructureRequest, UpdateStructureRequest } from '@interfaces'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class StructureService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const structures = await this.prisma.structure.findMany({
      where: {
        deletedAt: {
          equals: null,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return {
      data: structures,
    }
  }

  async findOne(id: number) {
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

    return {
      data: structure,
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
