import { CalendarDays } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { StateGrid } from '@/internal/state-grid'

export function HoverCardShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <HoverCard>
              <HoverCardTrigger render={<Button variant="link" />}>
                @nextjs
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold">@nextjs</h4>
                  <p className="text-sm">
                    The React Framework - created and maintained by @vercel.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="size-4" />
                    Joined December 2021
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ),
        },
        {
          label: 'side: right',
          node: (
            <HoverCard>
              <HoverCardTrigger render={<Button variant="link" />}>
                Hover me
              </HoverCardTrigger>
              <HoverCardContent side="right" className="w-64">
                <p className="text-sm">
                  Hover cards can open on any side of the trigger.
                </p>
              </HoverCardContent>
            </HoverCard>
          ),
        },
      ]}
    />
  )
}
