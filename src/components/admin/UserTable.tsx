'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserTableProps {
  data: User[];
}

export default function UserTable({ data }: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: '邮箱',
      cell: ({ row }) => (
        <Link 
          href={`/admin/users/${row.original.id}`}
          className="text-[#d4af37] hover:text-[#f4d03f] hover:underline transition-colors"
        >
          {row.original.email}
        </Link>
      ),
    },
    {
      accessorKey: 'name',
      header: '姓名',
      cell: ({ row }) => <span className="text-white">{row.original.name || '-'}</span>,
    },
    {
      accessorKey: 'role',
      header: '角色',
      cell: ({ row }) => {
        const roleMap: Record<string, { label: string; color: string }> = {
          ADMIN: { label: '管理员', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
          PRO: { label: '专业版', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
          FREE: { label: '免费版', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
        };
        const role = roleMap[row.original.role] || roleMap.FREE;
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${role.color}`}>
            {role.label}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: '注册时间',
      cell: ({ row }) => (
        <span className="text-gray-400">
          {new Date(row.original.createdAt).toLocaleDateString('zh-CN')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <Link
          href={`/admin/users/${row.original.id}`}
          className="text-sm text-[#d4af37] hover:text-[#f4d03f] transition-colors"
        >
          查看详情
        </Link>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="搜索邮箱或姓名..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-4 py-2 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
        />
        <select
          value={(table.getColumn('role')?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn('role')?.setFilterValue(e.target.value || undefined)}
          className="px-4 py-2 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
        >
          <option value="">所有角色</option>
          <option value="ADMIN">管理员</option>
          <option value="PRO">专业版</option>
          <option value="FREE">免费版</option>
        </select>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto bg-[#111111] border border-[#1a1a1a] rounded-xl">
        <table className="min-w-full divide-y divide-[#1a1a1a]">
          <thead className="bg-[#0a0a0a]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-[#111111] transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="text-[#d4af37]">
                          {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#0a0a0a] transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          显示 {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} 到{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          条，共 {table.getFilteredRowModel().rows.length} 条
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#d4af37]/30 transition-colors"
          >
            上一页
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-[#111111] border border-[#1a1a1a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#d4af37]/30 transition-colors"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}
