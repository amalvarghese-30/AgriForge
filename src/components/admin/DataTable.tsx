import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export interface ColumnDef<T> {
  header: string;
  accessor?: keyof T;
  className?: string;
  render?: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  emptyMessage = 'No data found.',
  keyExtractor,
  page,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={i} className={col.className}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="grid place-items-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="py-12 text-center text-sm text-muted-foreground">{emptyMessage}</div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow key={keyExtractor(row)}>
                {columns.map((col, j) => (
                  <TableCell key={j} className={col.className}>
                    {col.render ? col.render(row, i) : (col.accessor ? String(row[col.accessor] ?? '') : '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {page && totalPages && totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
