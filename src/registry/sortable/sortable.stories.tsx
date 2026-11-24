import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fireEvent, waitFor, within } from 'storybook/test'

import { Badge } from '@/components/ui/badge'
import { SortableHandle, SortableItem, SortableList } from './sortable'

const meta = {
  title: 'Cyphix/Sortable',
  tags: ['autodocs'],
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function ChipsDemo({ disabled = false }: { disabled?: boolean }) {
  const [chips, setChips] = useState(['species', 'age', 'height', 'deceased'])
  return (
    <SortableList items={chips} getId={(chip) => chip} onReorder={setChips}>
      <div className="flex flex-wrap gap-1">
        {chips.map((chip) => (
          <SortableItem key={chip} id={chip} disabled={disabled}>
            <Badge variant="secondary">
              <SortableHandle aria-label={`Reorder ${chip}`} disabled={disabled} className="-ml-1.5 size-4 text-muted-foreground" />
              {chip}
            </Badge>
          </SortableItem>
        ))}
      </div>
    </SortableList>
  )
}

function itemLabels(canvasElement: HTMLElement) {
  return Array.from(canvasElement.querySelectorAll('[data-slot="sortable-item"]')).map((item) => item.textContent?.trim())
}

export const Chips: Story = {
  render: () => <ChipsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(itemLabels(canvasElement)).toEqual(['species', 'age', 'height', 'deceased'])
    const handle = canvas.getByRole('button', { name: 'Reorder species' })
    handle.focus()
    fireEvent.keyDown(handle, { key: ' ', code: 'Space' })
    await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'true'))
    fireEvent.keyDown(handle, { key: 'ArrowRight', code: 'ArrowRight' })
    await new Promise((resolve) => setTimeout(resolve, 0))
    fireEvent.keyDown(handle, { key: ' ', code: 'Space' })
    await waitFor(() => expect(itemLabels(canvasElement)).toEqual(['age', 'species', 'height', 'deceased']))
  },
}

export const Disabled: Story = {
  render: () => <ChipsDemo disabled />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Reorder species' })).toBeDisabled()
  },
}
