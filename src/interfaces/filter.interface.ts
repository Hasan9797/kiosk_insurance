interface Filter {
  column: string
  value: string | number | string[]
  operator: string
}

interface Sort {
  column: string
  value: 'asc' | 'desc'
}

export interface QueryParams {
  filters: Filter[]
  sort: Sort
  limit: number
  page: number
}
