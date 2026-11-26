import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { TextInput, type TextInputProps } from './text-input'

const meta = {
  title: 'Cyphix/Text Input',
  component: TextInput,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Name',
    className: 'max-w-xs',
    defaultValue: 'Rosa',
    onClear: fn(),
  },
  argTypes: {
    clearable: { control: 'boolean' },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    value: { control: false },
  },
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>

function ControlledExample({ defaultValue, onChange, ...props }: TextInputProps) {
  const [value, setValue] = useState(String(defaultValue ?? ''))
  return (
    <TextInput
      {...props}
      value={value}
      onChange={(event) => {
        setValue(event.currentTarget.value)
        onChange?.(event)
      }}
    />
  )
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toHaveValue('Rosa')
    await expect(canvas.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
  },
}

export const Clearable: Story = {
  args: { clearable: true },
  render: (args) => (
    <ControlledExample key={String(args.defaultValue ?? '')} {...args} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Name' })
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }))
    await expect(input).toHaveValue('')
    await expect(input).toHaveFocus()
    await expect(args.onClear).toHaveBeenCalledOnce()
    await expect(canvas.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
    await userEvent.type(input, 'Rose')
    await expect(canvas.getByRole('button', { name: 'Clear' })).toBeVisible()
  },
}
