import { act } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { CollectionView } from '@/registry/collection-view/collection-view'

type Item = {
  id: string
  name: string
  status: string
  price: number
}

const items: Item[] = Array.from({ length: 30 }, (_, index) => ({
  id: `item-${index + 1}`,
  name: `Item ${index + 1}`,
  status: index % 2 === 0 ? 'Active' : 'Paused',
  price: index + 1,
}))

const columns: LegacyColumnDef<Item>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'price', header: 'Price' },
]

function renderCard(item: Item) {
  return <div data-testid="item-card">{item.name}</div>
}

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  callback: IntersectionObserverCallback
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  trigger(isIntersecting = true) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }
}

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
  window.HTMLElement.prototype.hasPointerCapture = vi.fn()
  window.HTMLElement.prototype.releasePointerCapture = vi.fn()
})

beforeEach(() => {
  MockIntersectionObserver.instances = []
})

function gridCardCount(container: HTMLElement) {
  return container.querySelector('[data-slot="collection-view-grid"]')
    ?.childElementCount
}

function triggerLastObserver() {
  const observer = MockIntersectionObserver.instances.at(-1)
  expect(observer).toBeDefined()
  act(() => observer!.trigger())
}

describe('CollectionView', () => {
  it('renders the table by default and switches to the grid', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <CollectionView data={items} columns={columns} renderCard={renderCard} />,
    )

    expect(
      container.querySelector('[data-slot="collection-view-table"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="collection-view-grid"]'),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Grid view' }))

    expect(
      container.querySelector('[data-slot="collection-view-table"]'),
    ).not.toBeInTheDocument()
    expect(gridCardCount(container)).toBe(10)

    await user.click(screen.getByRole('button', { name: 'Table view' }))
    expect(
      container.querySelector('[data-slot="collection-view-table"]'),
    ).toBeInTheDocument()
  })

  it('renders pagination at top, bottom, both, or none', () => {
    const { container, rerender } = render(
      <CollectionView
        data={items}
        columns={columns}
        renderCard={renderCard}
        pagination="both"
      />,
    )
    expect(screen.getAllByRole('navigation')).toHaveLength(2)

    rerender(
      <CollectionView
        data={items}
        columns={columns}
        renderCard={renderCard}
        pagination="top"
      />,
    )
    expect(screen.getAllByRole('navigation')).toHaveLength(1)
    const getBar = () =>
      container.querySelector('[data-slot="collection-view-pagination"]')!
    const getTable = () =>
      container.querySelector('[data-slot="collection-view-table"]')!
    expect(getBar().compareDocumentPosition(getTable())).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )

    rerender(
      <CollectionView
        data={items}
        columns={columns}
        renderCard={renderCard}
        pagination="bottom"
      />,
    )
    expect(getBar().compareDocumentPosition(getTable())).toBe(
      Node.DOCUMENT_POSITION_PRECEDING,
    )

    rerender(
      <CollectionView
        data={items}
        columns={columns}
        renderCard={renderCard}
        pagination="none"
      />,
    )
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    // With controls hidden, all rows render instead of the first page.
    expect(screen.getAllByRole('row')).toHaveLength(31)
  })

  it('navigates pages and honors custom pageSizeOptions', async () => {
    const user = userEvent.setup()
    render(
      <CollectionView
        data={items}
        columns={columns}
        renderCard={renderCard}
        pageSizeOptions={[5, 12]}
      />,
    )

    // Custom options applied — page size defaults to the first option (5).
    expect(screen.getAllByRole('row')).toHaveLength(6) // header + 5 rows
    expect(screen.getByText('Page 1 of 6')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '2' }))
    expect(screen.getByText('Page 2 of 6')).toBeInTheDocument()

    await user.click(
      screen.getByRole('combobox', { name: 'Rows per page' }),
    )
    await user.click(screen.getByRole('option', { name: '12' }))
    expect(screen.getAllByRole('row')).toHaveLength(13)
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
  })

  it('shows every row when "All" is selected', async () => {
    const user = userEvent.setup()
    render(
      <CollectionView data={items} columns={columns} renderCard={renderCard} />,
    )

    await user.click(
      screen.getByRole('combobox', { name: 'Rows per page' }),
    )
    await user.click(screen.getByRole('option', { name: 'All' }))

    expect(screen.getAllByRole('row')).toHaveLength(31)
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()
  })

  it('toggles table columns from the Columns menu', async () => {
    const user = userEvent.setup()
    render(
      <CollectionView data={items} columns={columns} renderCard={renderCard} />,
    )

    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument()

    // Base UI menus don't respond to userEvent's pointer sequence in jsdom.
    fireEvent.click(screen.getByRole('button', { name: /columns/i }))
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Status' }))
    // Menu stays open while toggling; close it so the table is not aria-hidden.
    await user.keyboard('{Escape}')

    expect(
      screen.queryByRole('columnheader', { name: 'Status' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument()
  })

  it('progressively reveals grid items in local infinite-scroll mode', () => {
    const { container } = render(
      <CollectionView
        data={items}
        columns={columns}
        renderCard={renderCard}
        defaultView="grid"
        infiniteScroll
      />,
    )

    expect(gridCardCount(container)).toBe(10)
    // Pagination is hidden while infinite scroll is active.
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()

    triggerLastObserver()
    expect(gridCardCount(container)).toBe(20)

    triggerLastObserver()
    expect(gridCardCount(container)).toBe(30)

    // Sentinel is removed once everything is revealed.
    expect(
      container.querySelector('[data-slot="collection-view-sentinel"]'),
    ).not.toBeInTheDocument()
  })

  it('calls onLoadMore in async infinite-scroll mode', () => {
    const onLoadMore = vi.fn()
    const { container, rerender } = render(
      <CollectionView
        data={items.slice(0, 10)}
        columns={columns}
        renderCard={renderCard}
        defaultView="grid"
        infiniteScroll
        onLoadMore={onLoadMore}
        hasMore
        isLoadingMore={false}
      />,
    )

    triggerLastObserver()
    expect(onLoadMore).toHaveBeenCalledTimes(1)

    rerender(
      <CollectionView
        data={items.slice(0, 10)}
        columns={columns}
        renderCard={renderCard}
        defaultView="grid"
        infiniteScroll
        onLoadMore={onLoadMore}
        hasMore
        isLoadingMore
      />,
    )
    triggerLastObserver()
    expect(onLoadMore).toHaveBeenCalledTimes(1)
    expect(
      container.querySelector('[data-slot="collection-view-loading-more"]'),
    ).toBeInTheDocument()

    rerender(
      <CollectionView
        data={items.slice(0, 10)}
        columns={columns}
        renderCard={renderCard}
        defaultView="grid"
        infiniteScroll
        onLoadMore={onLoadMore}
        hasMore={false}
        isLoadingMore={false}
      />,
    )
    // Sentinel removed once hasMore flips false — no further loads.
    expect(
      container.querySelector('[data-slot="collection-view-sentinel"]'),
    ).not.toBeInTheDocument()
    triggerLastObserver()
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })
})
