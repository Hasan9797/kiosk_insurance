import { HttpStatus } from '@enums'
import { Response, Pagination } from '@interfaces'

export function formatResponse<T>(status: number, data: T, pagination?: Pagination): Response<T> {
  if (status === HttpStatus.NO_CONTENT) {
    return
  }
  return { status, data, pagination }
}
