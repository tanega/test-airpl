import { defineStore } from 'pinia'

export const useIndicesParamsStore = defineStore('indicesParams', {
  state: () => ({
    page: 1,
    pageSize: 50,
    dateFrom: '',
    dateTo: '',
    sort: 'asc' as 'asc' | 'desc',
  }),
  actions: {
    setDateFrom(value: string) {
      this.dateFrom = value
      this.page = 1
    },
    setDateTo(value: string) {
      this.dateTo = value
      this.page = 1
    },
    toggleSort() {
      this.sort = this.sort === 'asc' ? 'desc' : 'asc'
      this.page = 1
    },
    setPageSize(pageSize: number) {
      this.pageSize = pageSize
      this.page = 1
    },
    nextPage() {
      this.page += 1
    },
    prevPage() {
      if (this.page > 1) this.page -= 1
    },
  },
})
