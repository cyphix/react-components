import { Fragment } from 'react'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const tags = Array.from({ length: 30 }).map(
  (_, i) => `v1.2.0-beta.${30 - i}`,
)

export function ScrollAreaShowcase() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ScrollArea className="h-72 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
          {tags.map((tag) => (
            <Fragment key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </Fragment>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea className="w-80 rounded-md border whitespace-nowrap">
        <div className="flex w-max gap-4 p-4">
          {['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'].map(
            (item) => (
              <div
                key={item}
                className="flex h-24 w-32 shrink-0 items-center justify-center rounded-md border bg-muted text-sm"
              >
                {item}
              </div>
            ),
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
