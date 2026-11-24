import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SparklesIcon } from 'lucide-react'
import { expect, userEvent, within } from 'storybook/test'

import { chatMessages } from '@/storybook/cyphix-fixtures'
import { ChatPanel, type ChatPanelMessage } from './chat-panel'
import { SidePanelInset, SidePanelProvider, SidePanelTab } from '@/registry/side-panel/side-panel'

function Demo({ loading = false, disabled = false, title = 'Assistant', placeholder = 'Type a message…' }: { loading?: boolean; disabled?: boolean; title?: string; placeholder?: string }) {
  const [messages, setMessages] = useState<ChatPanelMessage[]>(chatMessages)
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border">
      <SidePanelProvider defaultOpen={false} className="relative h-full min-h-full">
        <SidePanelInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
            <span className="text-sm font-medium">Workspace</span>
          </header>
          <div className="text-muted-foreground flex flex-1 items-center justify-center p-4 text-sm">Use the AI tab to open chat.</div>
        </SidePanelInset>
        <SidePanelTab aria-label="Toggle AI chat" className="absolute">
          <SparklesIcon />
        </SidePanelTab>
        <ChatPanel
          className="absolute h-full"
          title={title}
          messages={messages}
          loading={loading}
          disabled={disabled}
          placeholder={placeholder}
          headerActions={
            <button type="button" className="text-sm" onClick={() => setMessages(chatMessages)}>Reset</button>
          }
          onSend={(value) => {
            setMessages((current) => [
              ...current,
              { id: crypto.randomUUID(), role: 'user', content: value },
              { id: crypto.randomUUID(), role: 'assistant', content: `Echo: ${value}` },
            ])
          }}
        />
      </SidePanelProvider>
    </div>
  )
}

const meta = {
  title: 'Cyphix/Chat Panel',
  component: Demo,
  tags: ['autodocs'],
  args: { loading: false, disabled: false, title: 'Assistant', placeholder: 'Type a message…' },
  argTypes: {
    title: { control: 'text' },
    placeholder: { control: 'text' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Demo>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle AI chat' }))
    await userEvent.type(canvas.getByLabelText('Message'), 'Hello')
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }))
    await expect(canvas.getByText('Echo: Hello')).toBeInTheDocument()
  },
}

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle AI chat' }))
    await expect(canvas.getByLabelText('Message')).toBeDisabled()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle AI chat' }))
    await expect(canvas.getByLabelText('Message')).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Send message' })).toBeDisabled()
  },
}
