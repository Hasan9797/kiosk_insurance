import { Injectable } from '@nestjs/common'
import { CreatePartnerDto } from './dto/create-partner.dto'
import { UpdatePartnerDto } from './dto/update-partner.dto'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return 'This action adds a new partner'
  }

  findAll() {
    return `This action returns all partners`
  }

  findOne(id: number) {
    return `This action returns a #${id} partner`
  }

  update(id: number, updatePartnerDto: UpdatePartnerDto) {
    return `This action updates a #${id} partner`
  }

  remove(id: number) {
    return `This action removes a #${id} partner`
  }
}
