"use client"

import * as React from "react"
import { PanelRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SIDE_PANEL_WIDTH = "24rem"

type SidePanelContextValue = {
  open: boolean
  setOpen: (open: boolean | ((value: boolean) => boolean)) => void
  toggle: () => void
  side: "left" | "right"
  panelId: string
}

const SidePanelContext = React.createContext<SidePanelContextValue | null>(null)

function useSidePanel() {
  const context = React.useContext(SidePanelContext)
  if (!context) {
    throw new Error("useSidePanel must be used within a SidePanelProvider.")
  }
  return context
}

function SidePanelProvider({
  defaultOpen = false,
  open: openProp,
  onOpenChange: setOpenProp,
  width = SIDE_PANEL_WIDTH,
  side = "right",
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  width?: string
  side?: "left" | "right"
}) {
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const panelId = React.useId()

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
    },
    [setOpenProp, open]
  )

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev)
  }, [setOpen])

  const contextValue = React.useMemo<SidePanelContextValue>(
    () => ({
      open,
      setOpen,
      toggle,
      side,
      panelId,
    }),
    [open, setOpen, toggle, side, panelId]
  )

  return (
    <SidePanelContext.Provider value={contextValue}>
      <div
        data-slot="side-panel-provider"
        data-state={open ? "open" : "closed"}
        data-side={side}
        style={
          {
            "--side-panel-width": width,
            ...style,
          } as React.CSSProperties
        }
        className={cn("flex min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </SidePanelContext.Provider>
  )
}

function SidePanel({
  side: sideProp,
  width,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  width?: string
}) {
  const { open, side: sideFromContext, panelId } = useSidePanel()
  const side = sideProp ?? sideFromContext
  const state = open ? "open" : "closed"

  return (
    <div
      className="group peer"
      data-state={state}
      data-side={side}
      data-slot="side-panel"
      style={
        {
          ...(width ? { "--side-panel-width": width } : {}),
          ...style,
        } as React.CSSProperties
      }
    >
      {/* In-flow spacer — reserves width so main content reflows */}
      <div
        data-slot="side-panel-gap"
        className={cn(
          "relative w-(--side-panel-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[state=closed]:w-0"
        )}
      />
      <div
        data-slot="side-panel-container"
        className={cn(
          "fixed inset-y-0 z-10 flex h-svh w-(--side-panel-width) transition-[left,right,width] duration-200 ease-linear",
          "group-data-[state=closed]:pointer-events-none",
          side === "left"
            ? "left-0 group-data-[state=closed]:left-[calc(var(--side-panel-width)*-1)]"
            : "right-0 group-data-[state=closed]:right-[calc(var(--side-panel-width)*-1)]",
          className
        )}
        {...props}
      >
        <aside
          id={panelId}
          data-slot="side-panel-inner"
          data-state={state}
          data-side={side}
          role="complementary"
          aria-hidden={!open}
          className={cn(
            "flex h-full w-full flex-col overflow-hidden bg-background",
            "data-[side=left]:border-r data-[side=right]:border-l",
            "data-[state=closed]:border-0"
          )}
        >
          {children}
        </aside>
      </div>
    </div>
  )
}

function SidePanelInset({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="side-panel-inset"
      className={cn(
        "relative flex min-h-0 min-w-0 flex-1 flex-col bg-background",
        className
      )}
      {...props}
    />
  )
}

function SidePanelHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="side-panel-header"
      className={cn("flex shrink-0 flex-col gap-1.5 border-b p-4", className)}
      {...props}
    />
  )
}

function SidePanelContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="side-panel-content"
      className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", className)}
      {...props}
    />
  )
}

function SidePanelFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="side-panel-footer"
      className={cn("flex shrink-0 flex-col gap-2 border-t p-4", className)}
      {...props}
    />
  )
}

function SidePanelTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, toggle, panelId } = useSidePanel()

  return (
    <Button
      type="button"
      data-slot="side-panel-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={(event) => {
        onClick?.(event)
        toggle()
      }}
      {...props}
    >
      <PanelRightIcon />
      <span className="sr-only">Toggle side panel</span>
    </Button>
  )
}

function SidePanelTab({
  align = "middle",
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  align?: "top" | "middle" | "bottom"
}) {
  const { open, toggle, panelId, side } = useSidePanel()

  return (
    <button
      type="button"
      data-slot="side-panel-tab"
      data-state={open ? "open" : "closed"}
      data-side={side}
      data-align={align}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={(event) => {
        onClick?.(event)
        toggle()
      }}
      className={cn(
        "fixed z-20 flex h-24 w-9 items-center justify-center border bg-background text-foreground shadow-xs transition-[left,right,background-color,color] duration-200 ease-linear",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        "data-[side=right]:right-0 data-[side=right]:rounded-l-lg data-[side=right]:border-r-0 data-[side=right]:data-[state=open]:right-(--side-panel-width)",
        "data-[side=left]:left-0 data-[side=left]:rounded-r-lg data-[side=left]:border-l-0 data-[side=left]:data-[state=open]:left-(--side-panel-width)",
        "data-[align=top]:top-4 data-[align=middle]:top-1/2 data-[align=middle]:-translate-y-1/2 data-[align=bottom]:bottom-4",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children ?? <PanelRightIcon />}
      <span className="sr-only">Toggle side panel</span>
    </button>
  )
}

export {
  SidePanel,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelInset,
  SidePanelProvider,
  SidePanelTab,
  SidePanelTrigger,
  useSidePanel,
}
