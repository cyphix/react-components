"use client"

import * as React from "react"
import {
  type ColumnVisibilityState,
  flexRender,
  type RowData,
} from "@tanstack/react-table"
import {
  getCoreRowModel,
  getPaginationRowModel,
  type LegacyColumn,
  type LegacyColumnDef,
  useLegacyTable,
} from "@tanstack/react-table/legacy"
import {
  ChevronDownIcon,
  LayoutGridIcon,
  Table2Icon,
} from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type CollectionViewMode = "table" | "grid"

type CollectionViewPaginationPosition = "top" | "bottom" | "both" | "none"

type CollectionViewPageSizeOption = number | "all"

const DEFAULT_PAGE_SIZE_OPTIONS: CollectionViewPageSizeOption[] = [
  10,
  25,
  50,
  100,
  "all",
]

function columnLabel<TData extends RowData>(
  column: LegacyColumn<TData, unknown>
) {
  const header = column.columnDef.header
  return typeof header === "string" ? header : column.id
}

function getPageItems(pageIndex: number, pageCount: number) {
  const page = pageIndex + 1
  const items: Array<number | "ellipsis"> = []
  let previous = 0
  const pages = [
    ...new Set(
      [1, pageCount, page - 1, page, page + 1].filter(
        (value) => value >= 1 && value <= pageCount
      )
    ),
  ].sort((a, b) => a - b)

  for (const value of pages) {
    if (value - previous > 1) items.push("ellipsis")
    items.push(value)
    previous = value
  }
  return items
}

function CollectionViewPagination({
  pageIndex,
  pageCount,
  pageSizeOption,
  pageSizeOptions,
  onPageChange,
  onPageSizeOptionChange,
}: {
  pageIndex: number
  pageCount: number
  pageSizeOption: string
  pageSizeOptions: CollectionViewPageSizeOption[]
  onPageChange: (pageIndex: number) => void
  onPageSizeOptionChange: (option: string) => void
}) {
  const items = getPageItems(pageIndex, pageCount)

  return (
    <div
      data-slot="collection-view-pagination"
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page</span>
        <Select
          value={pageSizeOption}
          onValueChange={(value) => {
            if (value != null) onPageSizeOptionChange(value)
          }}
        >
          <SelectTrigger
            size="sm"
            className="w-20"
            aria-label="Rows per page"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((option) => (
              <SelectItem key={String(option)} value={String(option)}>
                {option === "all" ? "All" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={pageIndex === 0}
              className={cn(
                pageIndex === 0 && "pointer-events-none opacity-50"
              )}
              onClick={(event) => {
                event.preventDefault()
                onPageChange(pageIndex - 1)
              }}
            />
          </PaginationItem>
          {items.map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={item === pageIndex + 1}
                  onClick={(event) => {
                    event.preventDefault()
                    onPageChange(item - 1)
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={pageIndex >= pageCount - 1}
              className={cn(
                pageIndex >= pageCount - 1 && "pointer-events-none opacity-50"
              )}
              onClick={(event) => {
                event.preventDefault()
                onPageChange(pageIndex + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <p className="text-sm text-muted-foreground">
        Page {pageIndex + 1} of {Math.max(pageCount, 1)}
      </p>
    </div>
  )
}

function CollectionView<TData extends RowData, TValue>({
  data,
  columns,
  renderCard,
  getItemKey,
  getRowId,
  view: viewProp,
  defaultView = "table",
  onViewChange,
  showViewToggle = true,
  pagination = "bottom",
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  defaultPageSize,
  infiniteScroll = false,
  onLoadMore,
  hasMore = true,
  isLoadingMore = false,
  onEndReached,
  gridClassName,
  emptyState,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  data: TData[]
  columns: LegacyColumnDef<TData, TValue>[]
  /** Render an item as a card in the grid view. */
  renderCard: (item: TData) => React.ReactNode
  /** Key for grid items. Defaults to the table row id. */
  getItemKey?: (item: TData, index: number) => React.Key
  /** Resolve a stable id for each row/item (forwarded to the table). */
  getRowId?: (item: TData, index: number) => string
  view?: CollectionViewMode
  defaultView?: CollectionViewMode
  onViewChange?: (view: CollectionViewMode) => void
  /** Show the table/grid toggle in the toolbar. */
  showViewToggle?: boolean
  /** Where to render the pagination bar. Hidden in infinite-scroll grid mode. */
  pagination?: CollectionViewPaginationPosition
  /** Options for the "rows per page" selector. */
  pageSizeOptions?: CollectionViewPageSizeOption[]
  defaultPageSize?: number
  /**
   * Grid-only: load more items as the bottom sentinel enters the viewport.
   * When `onLoadMore` is provided, loading is consumer-driven (async mode);
   * otherwise the grid progressively reveals the next page-size chunk of
   * `data` until everything is shown.
   */
  infiniteScroll?: boolean
  onLoadMore?: () => void
  /** Async mode: set false when no more data can be fetched. */
  hasMore?: boolean
  /** Async mode: shows a spinner and pauses `onLoadMore` calls. */
  isLoadingMore?: boolean
  /** Local mode: fired once each time all items have been revealed. */
  onEndReached?: () => void
  /** Override the grid layout classes (default responsive 1/2/3 columns). */
  gridClassName?: string
  emptyState?: React.ReactNode
}) {
  const [internalView, setInternalView] = React.useState(defaultView)
  const view = viewProp ?? internalView
  const setView = React.useCallback(
    (next: CollectionViewMode) => {
      if (viewProp === undefined) setInternalView(next)
      onViewChange?.(next)
    },
    [viewProp, onViewChange]
  )

  const [pageIndex, setPageIndex] = React.useState(0)
  const [pageSizeOption, setPageSizeOption] = React.useState(() => {
    const initial =
      defaultPageSize ??
      pageSizeOptions.find((option) => option !== "all") ??
      "all"
    return String(initial)
  })
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})

  const pageSize =
    pageSizeOption === "all" ? Math.max(data.length, 1) : Number(pageSizeOption)
  const effectivePageSize =
    pagination === "none" ? Math.max(data.length, 1) : pageSize

  const table = useLegacyTable({
    data,
    columns: columns as LegacyColumnDef<TData>[],
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: { pageIndex, pageSize: effectivePageSize },
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize: effectivePageSize })
          : updater
      setPageIndex(next.pageIndex)
    },
    onColumnVisibilityChange: setColumnVisibility,
  })

  const pageCount = table.getPageCount()

  const handlePageSizeOptionChange = React.useCallback((option: string) => {
    setPageSizeOption(option)
    setPageIndex(0)
  }, [])

  const infiniteActive = view === "grid" && infiniteScroll
  const asyncMode = onLoadMore !== undefined

  const [visibleCount, setVisibleCount] = React.useState(pageSize)
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)
  const endReachedRef = React.useRef(false)

  React.useEffect(() => {
    if (!infiniteActive) return
    const sentinel = sentinelRef.current
    if (!sentinel || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      if (asyncMode) {
        if (hasMore && !isLoadingMore) onLoadMore()
      } else {
        setVisibleCount((count) => Math.min(count + pageSize, data.length))
      }
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [
    infiniteActive,
    asyncMode,
    hasMore,
    isLoadingMore,
    onLoadMore,
    pageSize,
    data.length,
    visibleCount,
  ])

  React.useEffect(() => {
    if (!infiniteActive || asyncMode) return
    if (visibleCount < data.length) {
      endReachedRef.current = false
      return
    }
    if (!endReachedRef.current) {
      endReachedRef.current = true
      onEndReached?.()
    }
  }, [infiniteActive, asyncMode, visibleCount, data.length, onEndReached])

  const showPagination = pagination !== "none" && !infiniteActive
  const showTopPagination = showPagination && pagination !== "bottom"
  const showBottomPagination = showPagination && pagination !== "top"

  const rows = infiniteActive
    ? table
        .getCoreRowModel()
        .rows.slice(0, asyncMode ? undefined : visibleCount)
    : table.getRowModel().rows

  const isEmpty = rows.length === 0
  const showSentinel =
    infiniteActive && (asyncMode ? hasMore : visibleCount < data.length)

  return (
    <div
      data-slot="collection-view"
      data-view={view}
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      {(showViewToggle || view === "table") && (
        <div
          data-slot="collection-view-toolbar"
          className="flex items-center justify-between gap-2"
        >
          {showViewToggle ? (
            <ToggleGroup
              variant="outline"
              size="sm"
              value={[view]}
              onValueChange={(value) => {
                const next = value[0]
                if (next) setView(next as CollectionViewMode)
              }}
              data-slot="collection-view-toggle"
            >
              <ToggleGroupItem value="table" aria-label="Table view">
                <Table2Icon />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGridIcon />
              </ToggleGroupItem>
            </ToggleGroup>
          ) : (
            <span />
          )}

          {view === "table" && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    data-slot="collection-view-columns-trigger"
                  />
                }
              >
                Columns
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllLeafColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(checked) =>
                          column.toggleVisibility(!!checked)
                        }
                        closeOnClick={false}
                      >
                        {columnLabel(column)}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {showTopPagination && (
        <CollectionViewPagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSizeOption={pageSizeOption}
          pageSizeOptions={pageSizeOptions}
          onPageChange={(index) => table.setPageIndex(index)}
          onPageSizeOptionChange={handlePageSizeOptionChange}
        />
      )}

      {view === "table" ? (
        <div data-slot="collection-view-table" className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isEmpty ? (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length || 1}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyState ?? "No results."}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          {isEmpty ? (
            <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
              {emptyState ?? "No results."}
            </div>
          ) : (
            <div
              data-slot="collection-view-grid"
              className={cn(
                "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                gridClassName
              )}
            >
              {rows.map((row, index) => (
                <React.Fragment
                  key={getItemKey?.(row.original, index) ?? row.id}
                >
                  {renderCard(row.original)}
                </React.Fragment>
              ))}
            </div>
          )}

          {isLoadingMore && (
            <div
              data-slot="collection-view-loading-more"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Spinner className="size-4" />
              Loading more…
            </div>
          )}

          {showSentinel && (
            <div
              ref={sentinelRef}
              data-slot="collection-view-sentinel"
              aria-hidden
              className="h-px"
            />
          )}
        </>
      )}

      {showBottomPagination && (
        <CollectionViewPagination
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSizeOption={pageSizeOption}
          pageSizeOptions={pageSizeOptions}
          onPageChange={(index) => table.setPageIndex(index)}
          onPageSizeOptionChange={handlePageSizeOptionChange}
        />
      )}
    </div>
  )
}

export { CollectionView, DEFAULT_PAGE_SIZE_OPTIONS }
export type {
  CollectionViewMode,
  CollectionViewPageSizeOption,
  CollectionViewPaginationPosition,
}
