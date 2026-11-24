import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { StateGrid } from '@/internal/state-grid'

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt', 'Remix', 'Astro']

function FrameworkCombobox({
  disabled = false,
  showClear = false,
}: {
  disabled?: boolean
  showClear?: boolean
}) {
  return (
    <Combobox items={frameworks}>
      <ComboboxInput
        placeholder="Select framework..."
        className="w-52"
        disabled={disabled}
        showClear={showClear}
      />
      <ComboboxContent>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function ComboboxShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <FrameworkCombobox /> },
        { label: 'with clear', node: <FrameworkCombobox showClear /> },
        { label: 'disabled', node: <FrameworkCombobox disabled /> },
      ]}
    />
  )
}

const meta = {
  tags: ['autodocs'],
  title: 'Shadcn/Combobox',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComboboxShowcase />,
}
