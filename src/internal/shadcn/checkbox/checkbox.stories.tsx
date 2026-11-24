import type { Meta, StoryObj } from '@storybook/react-vite'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { StateGrid } from '@/internal/state-grid'

function CheckboxShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <Checkbox /> },
        { label: 'checked', node: <Checkbox defaultChecked /> },
        { label: 'disabled', node: <Checkbox disabled /> },
        {
          label: 'disabled checked',
          node: <Checkbox disabled defaultChecked />,
        },
        { label: 'invalid', node: <Checkbox aria-invalid /> },
        {
          label: 'with label',
          node: (
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox-showcase-terms" />
              <Label htmlFor="checkbox-showcase-terms">
                Accept terms and conditions
              </Label>
            </div>
          ),
        },
      ]}
    />
  )
}

const meta = {
  title: 'Shadcn/Checkbox',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <CheckboxShowcase />,
}
