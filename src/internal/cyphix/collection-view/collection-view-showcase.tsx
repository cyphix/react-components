import { useCallback, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CollectionView } from '@/registry/collection-view/collection-view'

type Product = {
  id: string
  name: string
  category: string
  status: 'In stock' | 'Low stock' | 'Out of stock'
  price: number
  updated: string
}

const categories = ['Audio', 'Wearables', 'Accessories', 'Home', 'Office']
const statuses: Product['status'][] = ['In stock', 'Low stock', 'Out of stock']

const products: Product[] = Array.from({ length: 64 }, (_, index) => {
  const n = index + 1
  return {
    id: `prod-${n}`,
    name: `Product ${n}`,
    category: categories[index % categories.length],
    status: statuses[index % statuses.length],
    price: 19 + ((index * 37) % 480),
    updated: `2026-09-${String((index % 28) + 1).padStart(2, '0')}`,
  }
})

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<Product['status']>()
      return (
        <Badge
          variant={
            status === 'In stock'
              ? 'default'
              : status === 'Low stock'
                ? 'secondary'
                : 'destructive'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'price',
    header: () => <span className="block text-right">Price</span>,
    cell: ({ getValue }) => (
      <span className="block text-right">${getValue<number>().toFixed(2)}</span>
    ),
  },
  { accessorKey: 'updated', header: 'Updated' },
]

function renderProductCard(product: Product) {
  return (
    <Card className="gap-2 py-4">
      <CardHeader className="px-4">
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between px-4">
        <Badge
          variant={
            product.status === 'In stock'
              ? 'default'
              : product.status === 'Low stock'
                ? 'secondary'
                : 'destructive'
          }
        >
          {product.status}
        </Badge>
        <span className="text-sm font-medium">
          ${product.price.toFixed(2)}
        </span>
      </CardContent>
    </Card>
  )
}

function AsyncInfiniteDemo() {
  const [items, setItems] = useState<Product[]>(products.slice(0, 12))
  const [loading, setLoading] = useState(false)
  const hasMore = items.length < 36

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    setLoading(true)
    // Simulated fetch — appends the next chunk after a delay.
    setTimeout(() => {
      setItems((current) => [
        ...current,
        ...products.slice(current.length, current.length + 12),
      ])
      setLoading(false)
    }, 800)
  }, [loading, hasMore])

  return (
    <div className="max-h-[420px] overflow-y-auto rounded-lg border p-4">
      <CollectionView
        data={items}
        columns={columns}
        renderCard={renderProductCard}
        defaultView="grid"
        showViewToggle={false}
        infiniteScroll
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoadingMore={loading}
      />
    </div>
  )
}

export function CollectionViewShowcase() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">
          Table view (bottom pagination, column toggle)
        </h3>
        <CollectionView
          data={products}
          columns={columns}
          renderCard={renderProductCard}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Grid view (defaultView="grid")</h3>
        <CollectionView
          data={products}
          columns={columns}
          renderCard={renderProductCard}
          defaultView="grid"
        />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Pagination at top</h3>
        <CollectionView
          data={products}
          columns={columns}
          renderCard={renderProductCard}
          pagination="top"
          defaultPageSize={25}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">
          Pagination at top and bottom, custom page sizes
        </h3>
        <CollectionView
          data={products}
          columns={columns}
          renderCard={renderProductCard}
          pagination="both"
          pageSizeOptions={[5, 20, 'all']}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">
          Grid infinite scroll (progressive reveal, 10 at a time)
        </h3>
        <div className="max-h-[420px] overflow-y-auto rounded-lg border p-4">
          <CollectionView
            data={products}
            columns={columns}
            renderCard={renderProductCard}
            defaultView="grid"
            showViewToggle={false}
            infiniteScroll
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">
          Grid infinite scroll (async onLoadMore, stops at 36 items)
        </h3>
        <AsyncInfiniteDemo />
      </section>
    </div>
  )
}
