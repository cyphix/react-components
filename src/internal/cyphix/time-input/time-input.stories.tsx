import type { Meta, StoryObj } from '@storybook/react-vite'

import { useState } from 'react'

import { StateGrid } from '@/internal/state-grid'
import { DateTimeInput, TimeInput } from '@/registry/time-input/time-input'

function TimeExample({ seconds = false, disabled = false }) {
  const [value, setValue] = useState(seconds ? '13:45:00' : '13:45')
  return (
    <div className="flex flex-col gap-1">
      <TimeInput
        seconds={seconds}
        disabled={disabled}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <span className="text-muted-foreground text-xs">{value}</span>
    </div>
  )
}

function DateTimeExample() {
  const [value, setValue] = useState('2026-11-22T13:45:00')
  return (
    <div className="flex flex-col gap-1">
      <DateTimeInput seconds value={value} onChange={setValue} />
      <span className="text-muted-foreground text-xs">{value}</span>
    </div>
  )
}

function TimeInputShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'time', node: <TimeExample /> },
        { label: 'seconds', node: <TimeExample seconds /> },
        { label: 'date and time', node: <DateTimeExample /> },
        { label: 'disabled', node: <TimeExample disabled /> },
      ]}
    />
  )
}

const meta = {
  title: 'Cyphix/Time Input',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <TimeInputShowcase />,
}
