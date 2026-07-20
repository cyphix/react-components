import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller'

type ChatMessage = { id: number; from: 'me' | 'them'; text: string }

const initialMessages: ChatMessage[] = [
  { id: 1, from: 'them', text: 'Hey! Did you see the new registry components?' },
  { id: 2, from: 'me', text: 'Not yet, anything interesting?' },
  { id: 3, from: 'them', text: 'There is a whole chat kit now.' },
  { id: 4, from: 'them', text: 'Message scroller, bubbles, attachments…' },
  { id: 5, from: 'me', text: 'Nice. Does it handle auto-scroll?' },
  { id: 6, from: 'them', text: 'Yes, it pins to the end while streaming.' },
  { id: 7, from: 'me', text: 'And when you scroll up to read history?' },
  { id: 8, from: 'them', text: 'It stops following and shows a button.' },
  { id: 9, from: 'them', text: 'Click it to jump back to the latest message.' },
  { id: 10, from: 'me', text: 'That is exactly what I needed.' },
]

export function MessageScrollerShowcase() {
  const [messages, setMessages] = useState(initialMessages)

  function sendMessage() {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: prev.length % 2 === 0 ? 'them' : 'me',
        text: `New message #${prev.length + 1}`,
      },
    ])
  }

  return (
    <div className="max-w-md space-y-3">
      <MessageScrollerProvider defaultScrollPosition="end">
        <MessageScroller className="h-[320px] rounded-lg border">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-3 p-4">
              {messages.map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={String(message.id)}
                  className={
                    message.from === 'me'
                      ? 'flex justify-end'
                      : 'flex justify-start'
                  }
                >
                  <div
                    className={
                      message.from === 'me'
                        ? 'max-w-[80%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground'
                        : 'max-w-[80%] rounded-lg bg-muted px-3 py-2 text-sm'
                    }
                  >
                    {message.text}
                  </div>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <Button variant="outline" size="sm" onClick={sendMessage}>
        Send message
      </Button>
      <p className="text-muted-foreground text-xs">
        Scroll up to detach from the bottom — a scroll-to-end button appears.
      </p>
    </div>
  )
}
