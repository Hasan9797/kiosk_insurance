export interface CreateStructureRequest {
  name: string
  status: number
  regionId: number
}

export interface UpdateStructureRequest {
  name?: string
  status?: number
  regionId?: number
}
