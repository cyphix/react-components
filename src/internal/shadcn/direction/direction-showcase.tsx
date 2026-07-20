import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DirectionProvider, useDirection } from '@/components/ui/direction'

function DirectionDemo() {
  const direction = useDirection()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Home</span>
        <ArrowRightIcon className="size-3.5 rtl:rotate-180" />
        <span className="text-muted-foreground">Docs</span>
        <ArrowRightIcon className="size-3.5 rtl:rotate-180" />
        <span className="font-medium">Direction</span>
      </div>
      <div>
        <Button variant="outline">
          Continue
          <ArrowRightIcon className="rtl:rotate-180" />
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        Resolved direction from useDirection: <code>{direction ?? 'ltr'}</code>
      </p>
    </div>
  )
}

export function DirectionShowcase() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          ltr
        </span>
        <DirectionProvider dir="ltr">
          <div dir="ltr">
            <DirectionDemo />
          </div>
        </DirectionProvider>
      </div>
      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          rtl
        </span>
        <DirectionProvider dir="rtl">
          <div dir="rtl">
            <DirectionDemo />
          </div>
        </DirectionProvider>
      </div>
    </div>
  )
}
