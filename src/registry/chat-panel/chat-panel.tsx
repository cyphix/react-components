"use client"

import * as React from "react"
import { SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SidePanel,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
} from "@/registry/side-panel/side-panel"
import { cn } from "@/lib/utils"

type ChatPanelMessage = {
  id: string
  role: "user" | "assistant" | "system"
  content: React.ReactNode
}

function ChatPanel({
  title = "Chat",
  headerActions,
  messages,
  renderMessage,
  children,
  onSend,
  draft: draftProp,
  defaultDraft = "",
  onDraftChange,
  loading = false,
  disabled = false,
  placeholder = "Type a message…",
  emptyState,
  className,
  side = "right",
  ...props
}: Omit<React.ComponentProps<typeof SidePanel>, "children"> & {
  title?: React.ReactNode
  headerActions?: React.ReactNode
  messages?: ChatPanelMessage[]
  renderMessage?: (message: ChatPanelMessage) => React.ReactNode
  children?: React.ReactNode
  onSend?: (value: string) => void
  draft?: string
  defaultDraft?: string
  onDraftChange?: (value: string) => void
  loading?: boolean
  disabled?: boolean
  placeholder?: string
  emptyState?: React.ReactNode
}) {
  const [uncontrolledDraft, setUncontrolledDraft] = React.useState(defaultDraft)
  const isControlled = draftProp !== undefined
  const draftValue = isControlled ? draftProp : uncontrolledDraft
  const composerDisabled = disabled || loading

  function updateDraft(next: string) {
    if (!isControlled) {
      setUncontrolledDraft(next)
    }
    onDraftChange?.(next)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = draftValue.trim()
    if (!value || composerDisabled) return
    onSend?.(value)
    updateDraft("")
  }

  return (
    <SidePanel side={side} className={className} {...props}>
      <SidePanelHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <div className="text-sm font-medium">{title}</div>
        {headerActions ? (
          <div className="flex items-center gap-1">{headerActions}</div>
        ) : null}
      </SidePanelHeader>

      <SidePanelContent className="gap-3 p-4">
        {children ??
          (messages && messages.length > 0 ? (
            messages.map((message) =>
              renderMessage ? (
                <React.Fragment key={message.id}>
                  {renderMessage(message)}
                </React.Fragment>
              ) : (
                <div
                  key={message.id}
                  data-slot="chat-panel-message"
                  data-role={message.role}
                  className={cn(
                    "max-w-[90%] rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "mr-auto bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
              )
            )
          ) : (
            (emptyState ?? (
              <p className="text-muted-foreground text-sm">No messages yet.</p>
            ))
          ))}
      </SidePanelContent>

      <SidePanelFooter>
        <form
          className="flex items-center gap-2"
          onSubmit={handleSubmit}
        >
          <Input
            value={draftValue}
            onChange={(event) => updateDraft(event.target.value)}
            placeholder={placeholder}
            disabled={composerDisabled}
            aria-label="Message"
          />
          <Button
            type="submit"
            size="icon"
            disabled={composerDisabled || !draftValue.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </Button>
        </form>
      </SidePanelFooter>
    </SidePanel>
  )
}

export { ChatPanel }
export type { ChatPanelMessage }
