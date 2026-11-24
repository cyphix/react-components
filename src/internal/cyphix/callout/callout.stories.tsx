import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Callout,
  CalloutDescription,
  CalloutTitle,
} from '@/registry/callout/callout'
import { StateGrid } from '@/internal/state-grid'

function CalloutShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'info',
          node: (
            <Callout variant="info">
              <CalloutTitle>Heads up</CalloutTitle>
              <CalloutDescription>
                This is an informational callout.
              </CalloutDescription>
            </Callout>
          ),
        },
        {
          label: 'success',
          node: (
            <Callout variant="success">
              <CalloutTitle>Success</CalloutTitle>
              <CalloutDescription>
                The operation completed successfully.
              </CalloutDescription>
            </Callout>
          ),
        },
        {
          label: 'warning',
          node: (
            <Callout variant="warning">
              <CalloutTitle>Warning</CalloutTitle>
              <CalloutDescription>
                Double-check before continuing.
              </CalloutDescription>
            </Callout>
          ),
        },
        {
          label: 'destructive',
          node: (
            <Callout variant="destructive">
              <CalloutTitle>Error</CalloutTitle>
              <CalloutDescription>
                Something went wrong with the request.
              </CalloutDescription>
            </Callout>
          ),
        },
      ]}
    />
  )
}

const meta = {
  title: 'Cyphix/Callout',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <CalloutShowcase />,
}
