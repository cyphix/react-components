import type { Meta, StoryObj } from '@storybook/react-vite'
import { SparklesIcon } from 'lucide-react'
import { expect, userEvent, within } from 'storybook/test'

import {
  SidePanel,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelInset,
  SidePanelProvider,
  SidePanelTab,
  SidePanelTrigger,
} from './side-panel'

function Demo({
  label = 'Details',
  side = 'right',
  defaultOpen = true,
  width,
  showTrigger = true,
  showTab = false,
  tabAlign = 'middle',
}: {
  label?: string
  side?: 'left' | 'right'
  defaultOpen?: boolean
  width?: string
  showTrigger?: boolean
  showTab?: boolean
  tabAlign?: 'top' | 'middle' | 'bottom'
}) {
  const tab = showTab ? (
    <SidePanelTab align={tabAlign} aria-label="Toggle AI chat" className="absolute">
      <SparklesIcon />
    </SidePanelTab>
  ) : null
  const panel = (
    <SidePanel side={side} className="absolute h-full">
      <SidePanelHeader>
        <span className="text-sm font-medium">{label}</span>
      </SidePanelHeader>
      <SidePanelContent className="gap-2 p-4">
        {Array.from({ length: 8 }, (_, index) => (
          <p key={index} className="text-muted-foreground text-sm">Panel scroll item {index + 1}</p>
        ))}
      </SidePanelContent>
      <SidePanelFooter>
        <span className="text-muted-foreground text-xs">Panel footer</span>
      </SidePanelFooter>
    </SidePanel>
  )
  const inset = (
    <SidePanelInset>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
        {showTrigger ? <SidePanelTrigger /> : null}
        <span className="text-sm font-medium">Main content</span>
      </header>
      <div tabIndex={0} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        <p className="text-sm">Main content stays interactive while the panel is open.</p>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="text-muted-foreground text-sm">Main scroll item {index + 1}</p>
        ))}
      </div>
    </SidePanelInset>
  )

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-lg border">
      <SidePanelProvider defaultOpen={defaultOpen} side={side} width={width} className="relative h-full min-h-full">
        {side === 'left' ? <>{panel}{tab}{inset}</> : <>{inset}{tab}{panel}</>}
      </SidePanelProvider>
    </div>
  )
}

const meta = {
  title: 'Cyphix/Side Panel',
  component: Demo,
  tags: ['autodocs'],
  args: {
    label: 'Details',
    side: 'right',
    defaultOpen: true,
    showTrigger: true,
    showTab: false,
    tabAlign: 'middle',
  },
  argTypes: {
    label: { control: 'text' },
    side: { control: 'select', options: ['left', 'right'] },
    defaultOpen: { control: 'boolean' },
    width: { control: 'text' },
    showTrigger: { control: 'boolean' },
    showTab: { control: 'boolean' },
    tabAlign: { control: 'select', options: ['top', 'middle', 'bottom'] },
  },
} satisfies Meta<typeof Demo>

export default meta

type Story = StoryObj<typeof meta>

export const Right: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Toggle side panel' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}

export const Left: Story = {
  args: { side: 'left', label: 'Navigator' },
}

export const ClosedWithTab: Story = {
  args: { defaultOpen: false, showTrigger: false, showTab: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tab = canvas.getByRole('button', { name: 'Toggle AI chat' })
    await expect(tab).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(tab)
    await expect(tab).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('Panel scroll item 1')).toBeInTheDocument()
  },
}

export const CustomWidth: Story = {
  args: { width: '20rem' },
}
