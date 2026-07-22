import { useState } from 'react'
import { SparklesIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  SidePanel,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelInset,
  SidePanelProvider,
  SidePanelTab,
  SidePanelTrigger,
} from '@/registry/side-panel/side-panel'

function SidePanelDemo({
  label,
  side = 'right',
  defaultOpen = true,
  width,
  showTrigger = true,
  showTab = false,
  tabAlign = 'middle',
}: {
  label: string
  side?: 'left' | 'right'
  defaultOpen?: boolean
  width?: string
  showTrigger?: boolean
  showTab?: boolean
  tabAlign?: 'top' | 'middle' | 'bottom'
}) {
  const [clicks, setClicks] = useState(0)
  const tab = showTab ? (
    <SidePanelTab align={tabAlign} aria-label="Toggle AI chat">
      <SparklesIcon />
    </SidePanelTab>
  ) : null
  const panel = (
    <SidePanel side={side}>
      <SidePanelHeader>
        <span className="text-sm font-medium">{label}</span>
      </SidePanelHeader>
      <SidePanelContent className="gap-2 p-4">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} className="text-muted-foreground text-sm">
            Panel scroll item {index + 1}
          </p>
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
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        <p className="text-sm">
          Main content stays interactive and scrollable while the panel is open.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => setClicks((value) => value + 1)}
        >
          Clicked {clicks} times
        </Button>
        {Array.from({ length: 16 }, (_, index) => (
          <p key={index} className="text-muted-foreground text-sm">
            Main scroll item {index + 1}
          </p>
        ))}
      </div>
    </SidePanelInset>
  )

  return (
    <div className="h-[360px] w-full overflow-hidden rounded-lg border">
      <SidePanelProvider
        defaultOpen={defaultOpen}
        side={side}
        width={width}
        className="h-full"
      >
        <div className="flex h-full min-h-0 w-full">
          {side === 'left' ? (
            <>
              {panel}
              {tab}
              {inset}
            </>
          ) : (
            <>
              {inset}
              {tab}
              {panel}
            </>
          )}
        </div>
      </SidePanelProvider>
    </div>
  )
}

function ControlledSidePanelDemo() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setOpen((value) => !value)}
        >
          Parent toggle ({open ? 'open' : 'closed'})
        </Button>
      </div>
      <div className="h-[280px] w-full overflow-hidden rounded-lg border">
        <SidePanelProvider
          open={open}
          onOpenChange={setOpen}
          className="h-full"
        >
          <div className="flex h-full min-h-0 w-full">
            <SidePanelInset className="items-center justify-center p-4">
              <SidePanelTrigger />
            </SidePanelInset>
            <SidePanel side="right">
              <SidePanelHeader>
                <span className="text-sm font-medium">Controlled</span>
              </SidePanelHeader>
              <SidePanelContent className="p-4">
                <p className="text-muted-foreground text-sm">
                  Open state owned by the parent.
                </p>
              </SidePanelContent>
            </SidePanel>
          </div>
        </SidePanelProvider>
      </div>
    </div>
  )
}

export function SidePanelShowcase() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Right (default)</h3>
        <SidePanelDemo label="Details" side="right" />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Left</h3>
        <SidePanelDemo label="Navigator" side="left" />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Closed by default</h3>
        <SidePanelDemo label="Hidden" defaultOpen={false} />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Icon tab (middle)</h3>
        <SidePanelDemo
          label="AI chat"
          defaultOpen={false}
          showTrigger={false}
          showTab
          tabAlign="middle"
        />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Icon tab (top)</h3>
        <SidePanelDemo
          label="AI chat"
          defaultOpen={false}
          showTrigger={false}
          showTab
          tabAlign="top"
        />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Icon tab (bottom)</h3>
        <SidePanelDemo
          label="AI chat"
          defaultOpen={false}
          showTrigger={false}
          showTab
          tabAlign="bottom"
        />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Custom width</h3>
        <SidePanelDemo label="Wide" width="20rem" />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium">Controlled</h3>
        <ControlledSidePanelDemo />
      </section>
    </div>
  )
}
