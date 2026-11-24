import type { AuthUser } from '@cyphix/auth-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AttachmentListItem } from '@/registry/attachment-list/attachment-list'
import type { ChatPanelMessage } from '@/registry/chat-panel/chat-panel'
import type { CollectionViewColumnDef } from '@/registry/collection-view/collection-view'
import type { ComboboxOption } from '@/registry/creatable-combobox/creatable-combobox'

export const profileUser: AuthUser = {
  id: 1,
  username: 'alice',
  email: 'alice@example.com',
  role: 'user',
  disabled: false,
  hasPassword: true,
  passkeyCount: 1,
  oidcLinked: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

export const attachments: AttachmentListItem[] = [
  {
    id: 'image',
    name: 'Favicon.svg',
    description: 'SVG image',
    thumbnailUrl: '/favicon.svg',
    downloadUrl: '/favicon.svg',
  },
  { id: 'document', name: 'Notes.pdf', description: 'PDF document' },
]

export const comboboxOptions: ComboboxOption[] = [
  { value: 'apple', label: 'Apple', group: 'Fruit' },
  { value: 'pear', label: 'Pear', group: 'Fruit' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'pepper', label: 'Pepper', group: 'Vegetables' },
]

export const basicComboboxOptions = comboboxOptions.map(({ value, label }) => ({ value, label }))

export const chatMessages: ChatPanelMessage[] = [
  { id: '1', role: 'assistant', content: 'Hi — ask me anything about this panel.' },
  { id: '2', role: 'user', content: 'Does this overlay the page?' },
  { id: '3', role: 'assistant', content: 'No. It pushes the main content beside it.' },
]

export type Product = {
  id: string
  name: string
  category: string
  status: 'In stock' | 'Low stock' | 'Out of stock'
  price: number
  updated: string
}

const categories = ['Audio', 'Wearables', 'Accessories', 'Home', 'Office']
const statuses: Product['status'][] = ['In stock', 'Low stock', 'Out of stock']

export const products: Product[] = Array.from({ length: 64 }, (_, index) => {
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

export const productColumns: CollectionViewColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
  },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<Product['status']>()
      return (
        <Badge variant={status === 'In stock' ? 'default' : status === 'Low stock' ? 'secondary' : 'destructive'}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'price',
    header: () => <span className="block text-right">Price</span>,
    cell: ({ getValue }) => <span className="block text-right">${getValue<number>().toFixed(2)}</span>,
  },
  { accessorKey: 'updated', header: 'Updated' },
]

export function renderProductCard(product: Product) {
  return (
    <Card className="gap-2 py-4">
      <CardHeader className="px-4">
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between px-4">
        <Badge variant={product.status === 'In stock' ? 'default' : product.status === 'Low stock' ? 'secondary' : 'destructive'}>
          {product.status}
        </Badge>
        <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
      </CardContent>
    </Card>
  )
}
