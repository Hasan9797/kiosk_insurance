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

export interface GetMeUser {
  id?: number
  name?: string
  login: string
  code?: string
  role: {
    int?: number
    string: string
  }
  status: {
    int?: number
    string: string
  }
  cashCount?: number
  latitude?: number
  longitude?: number
  createdAt?: Date
  structure?: string
  incasatorId?: string
}

export interface GetMeResponse {
  data: GetMeUser
}
