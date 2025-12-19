'use client'

import React, { useState } from 'react'

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { FaStar } from 'react-icons/fa'
import { FiCheckCircle, FiFileText, FiGrid, FiSearch, FiFilter } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

// --- Types ---
export type Review = {
  id: string
  title: string
  description: string
  rating: number
  author: string
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
}

// --- Mock Data ---
const data: Review[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `rev-${i}`,
  title: `강의가 정말 도움이 많이 되었습니다 #${i + 1}`,
  description:
    '처음에는 어려울 줄 알았는데 강사님이 차근차근 설명해주셔서 이해하기 쉬웠습니다. 실무에 바로 적용할 수 있는 꿀팁들도 많아서 좋네요!',
  rating: 5,
  author: `user${i}@example.com`,
  createdAt: '2024-03-15',
  status: i % 3 === 0 ? 'pending' : 'approved',
}))

// --- Columns ---
const columns: ColumnDef<Review>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'content',
    header: 'Review Content',
    cell: ({ row }) => {
      const review = row.original
      return (
        <div className="flex flex-col gap-1 py-1">
          <div className="flex items-center gap-2">
            <FaStar className="size-4 text-yellow-400" />
            <span className="font-bold text-gray-800">{review.title}</span>
          </div>
          <p className="line-clamp-1 text-sm text-gray-500">{review.description}</p>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <div className="flex justify-end">
          <Button size="sm" variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">
            수정
          </Button>
        </div>
      )
    },
  },
]

// --- Components ---

function StatCard({
  icon: Icon,
  title,
  count,
  colorClass,
}: {
  icon: React.ElementType
  title: string
  count: number
  colorClass: string
}) {
  return (
    <div className="flex flex-1 items-center gap-4 rounded-xl border border-white/20 bg-white/40 p-6 shadow-sm backdrop-blur-md transition-transform hover:scale-[1.02]">
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg text-white shadow-md', colorClass)}>
        <Icon size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <span className="text-2xl font-bold text-gray-800">{count}건</span>
      </div>
    </div>
  )
}

export function ReviewTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  })

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">리뷰 관리</h2>
        <p className="text-gray-500">수강생들의 소중한 리뷰를 관리해보세요.</p>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4">
        <StatCard icon={FiFileText} title="승인 대기 중인 리뷰" count={17} colorClass="bg-orange-400" />
        <StatCard icon={FiCheckCircle} title="승인 완료된 리뷰" count={231} colorClass="bg-emerald-500" />
        <StatCard icon={FiGrid} title="전체 리뷰" count={248} colorClass="bg-blue-500" />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col rounded-2xl border border-white/20 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
        {/* Table Header / Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            리뷰 목록 <span className="ml-1 text-sm font-normal text-gray-500">({data.length})</span>
          </h3>
          <div className="flex gap-2">
            <div className="relative">
              <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <Input placeholder="리뷰 검색..." className="w-[200px] border-white/30 bg-white/50 pl-9" />
            </div>
            <Button variant="outline" size="icon" className="bg-white/50">
              <FiFilter />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white/30">
          <Table>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-b border-gray-100 transition-colors hover:bg-white/40"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    리뷰가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-gray-500 hover:text-gray-800"
          >
            이전
          </Button>
          <div className="flex items-center gap-1">
            {/* Creating a simplified pagination look */}
            <Button
              size="sm"
              variant={table.getState().pagination.pageIndex === 0 ? 'default' : 'ghost'}
              className={table.getState().pagination.pageIndex === 0 ? 'bg-gray-800 text-white' : ''}
            >
              1
            </Button>
            <Button size="sm" variant="ghost">
              2
            </Button>
            <Button size="sm" variant="ghost">
              3
            </Button>
            <span className="px-1 text-gray-400">...</span>
            <Button size="sm" variant="ghost">
              68
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-gray-500 hover:text-gray-800"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}
