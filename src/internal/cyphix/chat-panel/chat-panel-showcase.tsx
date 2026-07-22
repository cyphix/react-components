import { useState } from 'react'
import { SparklesIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  ChatPanel,
  type ChatPanelMessage,
} from '@/registry/chat-panel/chat-panel'
import {
  SidePanelInset,
  SidePanelProvider,
  SidePanelTab,
} from '@/registry/side-panel/side-panel'

const initialMessages: ChatPanelMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hi — ask me anything about this panel.',
  },
  {
    id: '2',
    role: 'user',
    content: 'Does this overlay the page?',
  },
  {
    id: '3',
    role: 'assistant',
    content: 'No. It pushes the main content beside it.',
  },
]

function ChatPanelDemo({
  loading = false,
  disabled = false,
}: {
  loading?: boolean
  disabled?: boolean
}) {
  const [messages, setMessages] = useState(initialMessages)

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-lg border">
      <SidePanelProvider defaultOpen={false} className="h-full">
        <div className="flex h-full min-h-0 w-full">
          <SidePanelInset>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
              <span className="text-sm font-medium">Workspace</span>
            </header>
            <div className="text-muted-foreground flex flex-1 items-center justify-center p-4 text-sm">
              Use the AI tab to open chat. Main area stays usable while open.
            </div>
          </SidePanelInset>
          <SidePanelTab aria-label="Toggle AI chat">
            <SparklesIcon />
          </SidePanelTab>
          <ChatPanel
            title="Assistant"
            messages={messages}
            loading={loading}
            disabled={disabled}
            headerActions={
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setMessages(initialMessages)}
              >
                Reset
              </Button>
            }
            onSend={(value) => {
              setMessages((current) => [
                ...current,
                { id: crypto.randomUUID(), role: 'user', content: value },
                {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content: `Echo: ${value}`,
                },
              ])
            }}
          />
        </div>
      </SidePanelProvider>
    </div>
  )
}

export function ChatPanelShowcase() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Default</h3>
        <ChatPanelDemo />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Loading</h3>
        <ChatPanelDemo loading />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Disabled</h3>
        <ChatPanelDemo disabled />
      </section>
    </div>
  )
}
