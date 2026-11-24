import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { DateTimeInput, TimeInput } from './time-input'

const meta = {
  title: 'Cyphix/Time Input',
  tags: ['autodocs'],
  args: { seconds: false, disabled: false },
  argTypes: {
    seconds: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<{ seconds?: boolean; disabled?: boolean }>

export default meta

type Story = StoryObj<typeof meta>

function TimeDemo({ seconds = false, disabled = false }: { seconds?: boolean; disabled?: boolean }) {
  const [value, setValue] = useState(seconds ? '13:45:00' : '13:45')
  return (
    <div className="flex flex-col gap-1">
      <TimeInput aria-label="Time" seconds={seconds} disabled={disabled} value={value} onChange={(event) => setValue(event.target.value)} />
      <span className="text-muted-foreground text-xs">{value}</span>
    </div>
  )
}

export const Time: Story = {
  render: (args) => <TimeDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Time')
    await userEvent.clear(input)
    await userEvent.type(input, '13:45')
    await expect(input).toHaveValue('13:45')
    await expect(canvas.getByText('13:45')).toBeInTheDocument()
  },
}

export const WithSeconds: Story = {
  args: { seconds: true },
  render: (args) => <TimeDemo {...args} />,
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <TimeDemo {...args} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText('Time')).toBeDisabled()
  },
}

function DateTimeDemo({ seconds = false, disabled = false }: { seconds?: boolean; disabled?: boolean }) {
  const [value, setValue] = useState(seconds ? '2026-11-22T13:45:00' : '2026-11-22T13:45')
  return (
    <div className="flex flex-col gap-1">
      <DateTimeInput seconds={seconds} value={value} onChange={setValue} timeProps={{ disabled }} dateProps={{ disabled, 'aria-label': 'Date' }} />
      <span className="text-muted-foreground text-xs">{value}</span>
    </div>
  )
}

export const DateTime: Story = {
  render: (args) => <DateTimeDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Time')
    await userEvent.clear(input)
    await userEvent.type(input, '14:30')
    await expect(input).toHaveValue('14:30')
  },
}
