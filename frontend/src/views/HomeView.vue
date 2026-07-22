<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { useIndicesParamsStore } from '@/stores/indices'
import { fetchIndices, type IndiceItem } from '@/lib/api'
import { columns } from './indices-columns'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import DatePicker from '@/components/DatePicker.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200]

const params = useIndicesParamsStore()

const data = ref<IndiceItem[]>([])
const total = ref(0)
const loading = ref(false)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    const result = await fetchIndices({
      page: params.page,
      pageSize: params.pageSize,
      dateFrom: params.dateFrom || undefined,
      dateTo: params.dateTo || undefined,
      sort: params.sort,
    })
    data.value = result.items
    total.value = result.total
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}

watchEffect(load)

const pageCount = computed(() => Math.max(1, Math.ceil(total.value / params.pageSize)))

const table = useVueTable({
  get data() {
    return data.value
  },
  columns,
  manualPagination: true,
  manualSorting: true,
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-4 p-6">
    <h1 class="text-2xl font-semibold">Indice ATMO</h1>

    <div class="flex flex-wrap items-end gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-sm text-muted-foreground">Du</label>
        <DatePicker
          placeholder="Choisir une date"
          :model-value="params.dateFrom"
          @update:model-value="(v) => params.setDateFrom(v)"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm text-muted-foreground">Au</label>
        <DatePicker
          placeholder="Choisir une date"
          :model-value="params.dateTo"
          @update:model-value="(v) => params.setDateTo(v)"
        />
      </div>
      <Button variant="outline" @click="params.toggleSort()">
        Trier par date ({{ params.sort === 'asc' ? 'croissant' : 'décroissant' }})
      </Button>
    </div>

    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

    <div class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        Page {{ params.page }} / {{ pageCount }} — {{ total }} résultats
      </p>
      <div class="flex items-center gap-3">
        <Select
          :model-value="String(params.pageSize)"
          @update:model-value="(v) => params.setPageSize(Number(v))"
        >
          <SelectTrigger class="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="size in PAGE_SIZE_OPTIONS" :key="size" :value="String(size)">
              {{ size }} / page
            </SelectItem>
          </SelectContent>
        </Select>
        <div class="flex gap-2">
          <Button variant="outline" :disabled="params.page <= 1" @click="params.prevPage()">
            Précédent
          </Button>
          <Button variant="outline" :disabled="params.page >= pageCount" @click="params.nextPage()">
            Suivant
          </Button>
        </div>
      </div>
    </div>

    <div class="rounded-md border overflow-hidden">
      <Table>
        <TableHeader class="bg-primary">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" class="hover:bg-transparent">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="text-primary-foreground font-bold"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell :colspan="columns.length" class="text-center text-muted-foreground">
              Chargement...
            </TableCell>
          </TableRow>
          <template v-else-if="table.getRowModel().rows.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <TableEmpty v-else :colspan="columns.length">Aucune donnée</TableEmpty>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
