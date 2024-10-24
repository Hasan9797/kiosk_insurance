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
  data: Region[]
}

export interface FindOneRegionResponse {
  data: Region
}
