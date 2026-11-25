import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { DateTimeInput, TimeInput, type TimeFormat } from './time-input'

const meta = {
  title: 'Cyphix/Time Input',
  component: TimeInput,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Time',
    defaultValue: '13:45',
    disabled: false,
    onChange: fn(),
    picker: true,
    seconds: false,
    timeFormat: '24h',
  },
  argTypes: {
    className: { control: false },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { control: false },
    picker: { control: 'boolean' },
    seconds: { control: 'boolean' },
    timeFormat: { control: 'select', options: ['12h', '24h'] },
    value: { control: false },
  },
} satisfies Meta<typeof TimeInput>

export default meta

type Story = StoryObj<typeof meta>

function popup() {
  return within(document.body)
}

export const Time: Story = {
  args: { defaultValue: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Time')
    await userEvent.type(input, '9:30')
    await expect(input).toHaveValue('9:30')
    await userEvent.tab()
    await waitFor(() => expect(input).toHaveValue('09:30'))
  },
}

export const TwelveHour: Story = {
  args: { defaultValue: '13:45', timeFormat: '12h' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = popup()
    const input = canvas.getByLabelText('Time')
    await expect(input).toHaveValue('1:45 PM')

    await userEvent.click(canvas.getByRole('button', { name: 'Open time picker' }))
    await userEvent.click(await body.findByRole('button', { name: 'Hour 3' }))
    await userEvent.click(body.getByRole('button', { name: 'Minute 30' }))
    await userEvent.click(body.getByRole('button', { name: 'AM' }))
    await expect(input).toHaveValue('3:30 AM')
  },
}

export const ManualValidation: Story = {
  args: { defaultValue: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Time')
    await userEvent.type(input, '25:00')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
  },
}

export const WithSeconds: Story = {
  args: { defaultValue: '13:45:30', seconds: true },
  play: async ({ canvasElement }) => {
    const body = popup()
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Open time picker' }),
    )
    await userEvent.click(await body.findByRole('button', { name: 'Second 05' }))
    await expect(
      within(canvasElement).getByLabelText('Time'),
    ).toHaveValue('13:45:05')
  },
}

export const WithoutPicker: Story = {
  args: { picker: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Time')).toHaveValue('13:45')
    await expect(
      canvas.queryByRole('button', { name: 'Open time picker' }),
    ).not.toBeInTheDocument()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Time')).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Open time picker' }),
    ).toBeDisabled()
  },
}

function DateTimeDemo({
  disabled = false,
  picker = true,
  seconds = false,
  timeFormat = '24h',
}: {
  disabled?: boolean
  picker?: boolean
  seconds?: boolean
  timeFormat?: TimeFormat
}) {
  const [value, setValue] = useState(
    seconds ? '2026-11-22T13:45:00' : '2026-11-22T13:45',
  )
  return (
    <DateTimeInput
      dateProps={{ 'aria-label': 'Date', disabled }}
      picker={picker}
      seconds={seconds}
      timeFormat={timeFormat}
      timeProps={{ 'aria-label': 'Time', disabled }}
      value={value}
      onChange={setValue}
    />
  )
}

export const DateTime: Story = {
  args: { seconds: true, timeFormat: '12h' },
  render: (args) => (
    <DateTimeDemo
      disabled={args.disabled}
      picker={args.picker}
      seconds={args.seconds}
      timeFormat={args.timeFormat}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Time')
    await expect(input).toHaveValue('1:45:00 PM')

    if (args.picker === false) return

    const body = popup()
    await userEvent.click(canvas.getByRole('button', { name: 'Open time picker' }))
    await userEvent.click(await body.findByRole('button', { name: 'Hour 3' }))
    await expect(input).toHaveValue('3:45:00 PM')
  },
}
