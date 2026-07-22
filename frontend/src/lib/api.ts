const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface IndiceItem {
  date: string
  lib_zone: string
  code_zone: number
  qualificatif: string
  type: string
  source: string
}

export interface IndicePage {
  total: number
  page: number
  page_size: number
  items: IndiceItem[]
}

export interface IndicesParams {
  page: number
  pageSize: number
  dateFrom?: string
  dateTo?: string
  sort: 'asc' | 'desc'
}

export async function fetchIndices(params: IndicesParams): Promise<IndicePage> {
  const url = new URL('/indices', API_BASE_URL)
  url.searchParams.set('page', String(params.page))
  url.searchParams.set('page_size', String(params.pageSize))
  if (params.dateFrom) url.searchParams.set('date_from', params.dateFrom)
  if (params.dateTo) url.searchParams.set('date_to', params.dateTo)
  url.searchParams.set('sort', params.sort)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}
