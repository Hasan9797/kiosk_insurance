import { Changer, Pagination } from '@interfaces'
import { Decimal } from '@prisma/client/runtime/library'

export interface CreateUserRequest {
  name: string
  login: string
  password: string
  role: number
  structureId: number
  incasatorId: number
  latitude?: string
  longitude?: string
}

interface FindUserResponse {
  id: number
  name: string
  login: string
  code: string
  role: Changer
  status: number
  cashCount: number
  latitude: Decimal
  longitude: Decimal
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null
  structureId: number | null
  incasatorId: number | null
}
export interface FindAllUserResponse {
  data: FindUserResponse[]
  pagination?: Pagination
}

export interface FindOneUserResponse {
  data: FindUserResponse
}
