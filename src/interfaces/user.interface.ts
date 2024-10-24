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
