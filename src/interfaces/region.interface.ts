import { Pagination } from '@interfaces'
export interface CreateRegionRequest {
  name: string
  status?: number
}

export interface UpdateRegionRequest {
  name?: string
  status?: number
}

interface Region {
  id: number
  name: string
  status: number
  createdAt: Date
}

export interface FindAllRegionResponse {
  data: Region[],
  pagination: Pagination
}

export interface FindOneRegionResponse {
  data: Region
}
