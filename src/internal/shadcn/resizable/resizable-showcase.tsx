import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

export function ResizableShowcase() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          horizontal
        </span>
        <div className="h-[200px] max-w-md rounded-lg border">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="50%">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">One</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="50%">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Two</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          nested vertical
        </span>
        <div className="h-[200px] max-w-md rounded-lg border">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="40%">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Sidebar</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="60%">
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel defaultSize="50%">
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Top</span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="50%">
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Bottom</span>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}
