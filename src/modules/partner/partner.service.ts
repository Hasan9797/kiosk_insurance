import { Injectable } from '@nestjs/common'

@Injectable()
export class PartnerService {
  create() {
    return 'This action adds a new partner'
  }

  findAll() {
    return `This action returns all partner`
  }

  findOne(id: number) {
    return `This action returns a #${id} partner`
  }

  update(id: number, data: any) {
    return `This action updates a #${id} partner`
  }

  remove(id: number) {
    return `This action removes a #${id} partner`
  }
}
