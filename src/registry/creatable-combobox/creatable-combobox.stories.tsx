import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn, expect, userEvent, waitFor, within } from 'storybook/test'

import { basicComboboxOptions, comboboxOptions } from '@/storybook/cyphix-fixtures'
import { CreatableCombobox, type ComboboxOption } from './creatable-combobox'

function Demo({
  options = basicComboboxOptions,
  allowCustom = false,
  disabled = false,
  clearable = false,
  onCreateNew,
}: {
  options?: ComboboxOption[]
  allowCustom?: boolean
  disabled?: boolean
  clearable?: boolean
  onCreateNew?: (query: string) => void
}) {
  const [value, setValue] = useState('')
  return (
    <>
      <label htmlFor="creatable-combobox" className="sr-only">Fruit</label>
      <CreatableCombobox
        id="creatable-combobox"
        className="w-64"
        options={options}
        value={value}
        onValueChange={setValue}
        allowCustom={allowCustom}
        disabled={disabled}
        clearable={clearable}
        onCreateNew={onCreateNew}
      />
    </>
  )
}

const meta = {
  title: 'Cyphix/Creatable Combobox',
  component: Demo,
  tags: ['autodocs'],
  args: {
    options: basicComboboxOptions,
    allowCustom: false,
    disabled: false,
    clearable: false,
    onCreateNew: undefined,
  },
  argTypes: {
    options: { control: false },
    allowCustom: { control: 'boolean' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    onCreateNew: { control: false },
  },
} satisfies Meta<typeof Demo>

export default meta

type Story = StoryObj<typeof meta>

function popup() {
  return within(document.body)
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = popup()
    const trigger = canvas.getByRole('combobox', { name: 'Fruit' })
    await userEvent.click(trigger)
    await userEvent.type(await body.findByRole('combobox', { name: 'Search…' }), 'App')
    await userEvent.click(await body.findByText('Apple'))
    await waitFor(() => expect(body.queryByRole('combobox', { name: 'Search…' })).not.toBeInTheDocument())
    await expect(trigger).toHaveTextContent('Apple')
  },
}

export const Grouped: Story = {
  args: { options: comboboxOptions },
  play: async ({ canvasElement }) => {
    const body = popup()
    await userEvent.click(within(canvasElement).getByRole('combobox', { name: 'Fruit' }))
    await expect(await body.findByText('Vegetables')).toBeInTheDocument()
    await expect(body.getByText('Carrot')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(body.queryByRole('combobox', { name: 'Search…' })).not.toBeInTheDocument())
  },
}

export const AllowCustom: Story = {
  args: { allowCustom: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = popup()
    const trigger = canvas.getByRole('combobox', { name: 'Fruit' })
    await userEvent.click(trigger)
    await userEvent.type(await body.findByRole('combobox', { name: 'Search…' }), 'Dragonfruit')
    await userEvent.click(await body.findByText('Use "Dragonfruit"'))
    await waitFor(() => expect(body.queryByRole('combobox', { name: 'Search…' })).not.toBeInTheDocument())
    await expect(trigger).toHaveTextContent('Dragonfruit')
  },
}

export const CreateNew: Story = {
  args: { onCreateNew: fn() },
  play: async ({ args, canvasElement }) => {
    const body = popup()
    await userEvent.click(within(canvasElement).getByRole('combobox', { name: 'Fruit' }))
    await userEvent.type(await body.findByRole('combobox', { name: 'Search…' }), 'Mango')
    await userEvent.click(await body.findByRole('button', { name: 'Create new…' }))
    await waitFor(() => expect(body.queryByRole('combobox', { name: 'Search…' })).not.toBeInTheDocument())
    await expect(args.onCreateNew).toHaveBeenCalledWith('Mango')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('combobox', { name: 'Fruit' })).toBeDisabled()
  },
}
