import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from '@/components/ui/message'
import { StateGrid } from '@/internal/state-grid'

export function MessageShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <div className="w-64">
              <Message>
                <MessageContent>
                  <Bubble variant="muted">
                    <BubbleContent>Hey, how is it going?</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </div>
          ),
        },
        {
          label: 'align: end',
          node: (
            <div className="w-64">
              <Message align="end">
                <MessageContent>
                  <Bubble align="end">
                    <BubbleContent>Pretty good, thanks!</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </div>
          ),
        },
        {
          label: 'with avatar',
          node: (
            <div className="w-64">
              <Message>
                <MessageAvatar>
                  <Avatar>
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                </MessageAvatar>
                <MessageContent>
                  <Bubble variant="muted">
                    <BubbleContent>Message with an avatar.</BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </div>
          ),
        },
        {
          label: 'header + footer',
          node: (
            <div className="w-64">
              <Message>
                <MessageContent>
                  <MessageHeader>Alice</MessageHeader>
                  <Bubble variant="muted">
                    <BubbleContent>See you tomorrow.</BubbleContent>
                  </Bubble>
                  <MessageFooter>9:41 AM</MessageFooter>
                </MessageContent>
              </Message>
            </div>
          ),
        },
      ]}
    />
  )
}
