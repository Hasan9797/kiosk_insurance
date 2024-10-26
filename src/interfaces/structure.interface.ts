import { Changer } from "@interfaces"
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

interface FindStructure {
  id: number,
  name: string,
  status: Changer,
  regionId: number,
  createdAt: Date
}

export interface FindAllStructureResponse {
  data: FindStructure[]
}

export interface FindOneStructureResponse {
  data: FindStructure
}