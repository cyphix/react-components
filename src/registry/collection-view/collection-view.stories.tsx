import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { productColumns, products, renderProductCard, type Product } from '@/storybook/cyphix-fixtures'
import { CollectionView } from './collection-view'

function SearchDemo({ searchPlaceholder = 'Search…', defaultPageSize = 10 }: { searchPlaceholder?: string; defaultPageSize?: number }) {
  const [search, setSearch] = useState('')
  const data = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <CollectionView
      key={defaultPageSize}
      data={data}
      columns={productColumns}
      renderCard={renderProductCard}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder={searchPlaceholder}
      defaultPageSize={defaultPageSize}
    />
  )
}

type CollectionStoryProps = {
  data: Product[]
  columns: typeof productColumns
  renderCard: typeof renderProductCard
  defaultView?: 'table' | 'grid'
  pagination?: 'top' | 'bottom' | 'both' | 'none'
  defaultPageSize?: number
  showViewToggle?: boolean
  searchPlaceholder?: string
}

const meta: Meta<CollectionStoryProps> = {
  title: 'Cyphix/Collection View',
  tags: ['autodocs'],
  args: {
    data: products,
    columns: productColumns,
    renderCard: renderProductCard,
    defaultView: 'table',
    pagination: 'bottom',
    defaultPageSize: 10,
    showViewToggle: true,
  },
  argTypes: {
    data: { control: false },
    columns: { control: false },
    renderCard: { control: false },
    defaultView: { control: 'select', options: ['table', 'grid'] },
    pagination: { control: 'select', options: ['top', 'bottom', 'both', 'none'] },
    defaultPageSize: { control: { type: 'number', min: 1 } },
    showViewToggle: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof meta>

function collectionArgs(args: Story['args']) {
  const { data, columns, renderCard, ...rest } = args as Record<string, unknown> & { data: Product[]; columns: typeof productColumns; renderCard: typeof renderProductCard }
  return { data, columns, renderCard, rest }
}

function renderCollection(args: Story['args']) {
  const { data, columns, renderCard, rest } = collectionArgs(args)
  const { defaultView, defaultPageSize } = rest as { defaultView?: unknown; defaultPageSize?: unknown }
  return (
    <CollectionView
      key={`${String(defaultView)}:${String(defaultPageSize)}`}
      data={data}
      columns={columns}
      renderCard={renderCard}
      {...rest}
    />
  )
}

export const Table: Story = {
  render: (args) => renderCollection(args),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Grid view' }))
    await expect(canvas.queryByRole('columnheader', { name: 'Name' })).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Table view' }))
    await expect(canvas.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
  },
}

export const Grid: Story = {
  args: { defaultView: 'grid' },
  render: (args) => renderCollection(args),
}

export const Search: Story = {
  args: { searchPlaceholder: 'Find product…' },
  argTypes: {
    searchPlaceholder: { control: 'text' },
  },
  render: (args) => <SearchDemo searchPlaceholder={args.searchPlaceholder} defaultPageSize={args.defaultPageSize} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const placeholder = args.searchPlaceholder ?? 'Search…'
    await userEvent.type(canvas.getByLabelText(placeholder), 'Product 21')
    await expect(canvas.getByText('Product 21')).toBeInTheDocument()
    await expect(canvas.queryByText('Product 1')).not.toBeInTheDocument()
  },
}

export const PaginationTop: Story = {
  args: { pagination: 'top', defaultPageSize: 25 },
  render: (args) => renderCollection(args),
}

export const NoPagination: Story = {
  args: { pagination: 'none', defaultPageSize: 20 },
  render: (args) => renderCollection(args),
}
