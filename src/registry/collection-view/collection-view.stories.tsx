import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { productColumns, products, renderProductCard, type Product } from '@/storybook/cyphix-fixtures'
import { CollectionView } from './collection-view'

function SearchDemo() {
  const [search, setSearch] = useState('')
  const data = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <CollectionView
      data={data}
      columns={productColumns}
      renderCard={renderProductCard}
      searchValue={search}
      onSearchChange={setSearch}
      defaultPageSize={10}
    />
  )
}

const meta = {
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
    searchPlaceholder: 'Search…',
  },
  argTypes: {
    data: { control: false },
    columns: { control: false },
    renderCard: { control: false },
    defaultView: { control: 'select', options: ['table', 'grid'] },
    pagination: { control: 'select', options: ['top', 'bottom', 'both', 'none'] },
    defaultPageSize: { control: { type: 'number', min: 1 } },
    showViewToggle: { control: 'boolean' },
    searchPlaceholder: { control: 'text' },
  },
} satisfies Meta<{
  data: Product[]
  columns: typeof productColumns
  renderCard: typeof renderProductCard
  defaultView?: 'table' | 'grid'
  pagination?: 'top' | 'bottom' | 'both' | 'none'
  defaultPageSize?: number
  showViewToggle?: boolean
  searchPlaceholder?: string
}>

export default meta

type Story = StoryObj<typeof meta>

function collectionArgs(args: Story['args']) {
  const { data, columns, renderCard, ...rest } = args as Record<string, unknown> & { data: Product[]; columns: typeof productColumns; renderCard: typeof renderProductCard }
  return { data, columns, renderCard, rest }
}

export const Table: Story = {
  render: (args) => {
    const { data, columns, renderCard, rest } = collectionArgs(args)
    return <CollectionView data={data} columns={columns} renderCard={renderCard} {...rest} />
  },
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
  render: (args) => {
    const { data, columns, renderCard, rest } = collectionArgs(args)
    return <CollectionView data={data} columns={columns} renderCard={renderCard} {...rest} />
  },
}

export const Search: Story = {
  render: () => <SearchDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Search…'), 'Product 21')
    await expect(canvas.getByText('Product 21')).toBeInTheDocument()
    await expect(canvas.queryByText('Product 1')).not.toBeInTheDocument()
  },
}

export const PaginationTop: Story = {
  args: { pagination: 'top', defaultPageSize: 25 },
  render: (args) => {
    const { data, columns, renderCard, rest } = collectionArgs(args)
    return <CollectionView data={data} columns={columns} renderCard={renderCard} {...rest} />
  },
}

export const NoPagination: Story = {
  args: { pagination: 'none', defaultPageSize: 20 },
  render: (args) => {
    const { data, columns, renderCard, rest } = collectionArgs(args)
    return <CollectionView data={data} columns={columns} renderCard={renderCard} {...rest} />
  },
}
