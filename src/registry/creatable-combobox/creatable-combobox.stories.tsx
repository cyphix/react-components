import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { fn, expect, userEvent, waitFor, within } from 'storybook/test'

import { basicComboboxOptions, comboboxOptions } from '@/storybook/cyphix-fixtures'
import { CreatableCombobox, type CreatableComboboxProps } from './creatable-combobox'

function Demo(args: CreatableComboboxProps) {
  const [value, setValue] = useState(args.value)
  const id = useId()
  const props: CreatableComboboxProps = args.multiple
    ? {
        ...args,
        value: Array.isArray(value) ? value : [],
        onValueChange: (next: string[]) => {
          setValue(next)
          args.onValueChange(next)
        },
      }
    : {
        ...args,
        value: typeof value === 'string' ? value : '',
        onValueChange: (next: string) => {
          setValue(next)
          args.onValueChange(next)
        },
      }
  return (
    <>
      <label htmlFor={id} className="sr-only">Fruit</label>
      <CreatableCombobox {...props} id={id} />
    </>
  )
}

function ServerSearchDemo(args: CreatableComboboxProps) {
  const [query, setQuery] = useState('')
  const { data, isFetching } = useQuery({
    queryKey: ['combobox-demo-options', args.options, query],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 250))
      const term = query.trim().toLowerCase()
      return args.options.filter(({ label }) =>
        (label === 'Apple' ? 'apple pome' : label.toLowerCase()).includes(term),
      )
    },
  })
  return (
    <Demo
      {...args}
      options={data ?? []}
      selectedOptions={args.options}
      loading={args.loading || isFetching}
      searchValue={query}
      onSearchChange={(next) => {
        setQuery(next)
        args.onSearchChange?.(next)
      }}
    />
  )
}

const meta = {
  title: 'Cyphix/Creatable Combobox',
  component: CreatableCombobox,
  render: (args) => <Demo {...args} />,
  tags: ['autodocs'],
  args: {
    options: basicComboboxOptions,
    value: '',
    onValueChange: fn(),
    className: 'w-64',
    allowCustom: false,
    createOnEnter: false,
    disabled: false,
    clearable: false,
    multiple: false,
    loading: false,
    onCreateNew: undefined,
  },
  argTypes: {
    options: { control: false },
    selectedOptions: { control: false },
    value: { control: false },
    onValueChange: { control: false },
    searchValue: { control: false },
    onSearchChange: { control: false },
    multiple: { control: 'boolean' },
    loading: { control: 'boolean' },
    allowCustom: { control: 'boolean' },
    createOnEnter: { control: 'boolean' },
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

export const CreateOnEnter: Story = {
  args: { createOnEnter: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = popup()
    const trigger = canvas.getByRole('combobox', { name: 'Fruit' })
    await userEvent.click(trigger)
    const search = await body.findByRole('combobox', { name: 'Search…' })
    await userEvent.type(search, 'Dragonfruit')
    await expect(body.queryByRole('option', { name: /Use/ })).not.toBeInTheDocument()
    await userEvent.keyboard('{Enter}')
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

export const ServerSearch: Story = {
  args: { onSearchChange: fn(), onCreateNew: fn() },
  render: (args) => <ServerSearchDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const body = popup()
    const trigger = within(canvasElement).getByRole('combobox', { name: 'Fruit' })
    await userEvent.click(trigger)
    const search = await body.findByRole('combobox', { name: 'Search…' })
    await userEvent.type(search, 'pome')
    await expect(body.getByRole('status')).toHaveTextContent('Loading…')
    await expect(args.onSearchChange).toHaveBeenLastCalledWith('pome')
    await userEvent.click(await body.findByRole('option', { name: 'Apple' }))
    await waitFor(() => expect(body.queryByRole('combobox', { name: 'Search…' })).not.toBeInTheDocument())
    await expect(trigger).toHaveTextContent('Apple')
    await userEvent.click(trigger)
    await userEvent.type(await body.findByRole('combobox', { name: 'Search…' }), 'Mango')
    await userEvent.click(body.getByRole('button', { name: 'Create new…' }))
    await expect(args.onCreateNew).toHaveBeenCalledWith('Mango')
    await waitFor(() => expect(body.queryByRole('combobox', { name: 'Search…' })).not.toBeInTheDocument())
  },
}

export const Multiple: Story = {
  args: {
    multiple: true,
    value: [],
    placeholder: 'Select fruit',
    onCreateNew: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = popup()
    const trigger = canvas.getByRole('combobox', { name: 'Fruit' })
    await userEvent.click(trigger)
    await userEvent.click(await body.findByRole('option', { name: 'Apple' }))
    await userEvent.click(body.getByRole('option', { name: 'Pear' }))
    await expect(body.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.type(body.getByRole('combobox', { name: 'Search…' }), 'Mango')
    await userEvent.click(body.getByRole('button', { name: 'Create new…' }))
    await waitFor(() => expect(body.queryByRole('combobox', { name: 'Search…' })).not.toBeInTheDocument())
    await expect(args.onCreateNew).toHaveBeenCalledWith('Mango')
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Apple' }))
    await expect(canvas.queryByRole('button', { name: 'Remove Apple' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Remove Pear' })).toBeVisible()
  },
}
