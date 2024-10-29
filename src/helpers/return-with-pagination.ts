export function paginationResponse(totalCount: number, limit: number, page: number) {
  const totalPages = Math.ceil(totalCount / limit)
  return {
    totalCount,
    totalPages,
    currentPage: page,
    limit,
  }
}