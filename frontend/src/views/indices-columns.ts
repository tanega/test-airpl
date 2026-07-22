import type { ColumnDef } from '@tanstack/vue-table'
import type { IndiceItem } from '@/lib/api'
import { formatDateFR } from '@/lib/date'

export const columns: ColumnDef<IndiceItem>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: (ctx) => formatDateFR(ctx.getValue<string>()),
  },
  { accessorKey: 'lib_zone', header: 'Commune' },
  { accessorKey: 'code_zone', header: 'Code INSEE' },
  { accessorKey: 'qualificatif', header: 'Qualificatif' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'source', header: 'Source' },
]
