import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group'
import { StateGrid } from '@/internal/state-grid'

function ButtonGroupShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'horizontal',
          node: (
            <ButtonGroup>
              <Button variant="outline">One</Button>
              <Button variant="outline">Two</Button>
              <Button variant="outline">Three</Button>
            </ButtonGroup>
          ),
        },
        {
          label: 'vertical',
          node: (
            <ButtonGroup orientation="vertical">
              <Button variant="outline">One</Button>
              <Button variant="outline">Two</Button>
              <Button variant="outline">Three</Button>
            </ButtonGroup>
          ),
        },
        {
          label: 'with separator',
          node: (
            <ButtonGroup>
              <Button variant="secondary">Save</Button>
              <ButtonGroupSeparator />
              <Button variant="secondary">Discard</Button>
            </ButtonGroup>
          ),
        },
        {
          label: 'with text',
          node: (
            <ButtonGroup>
              <ButtonGroupText>https://</ButtonGroupText>
              <Button variant="outline">example.com</Button>
            </ButtonGroup>
          ),
        },
      ]}
    />
  )
}

const meta = {
  tags: ['autodocs'],
  title: 'Shadcn/Button Group',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ButtonGroupShowcase />,
}
