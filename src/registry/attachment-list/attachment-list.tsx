"use client"

import { cn } from "cn"
import { DownloadIcon, FileIcon, XIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { buttonVariants } from "@/components/ui/button"

export type AttachmentListItem = {
  id: string
  name: string
  description?: string
  thumbnailUrl?: string
  downloadUrl?: string
}

export type AttachmentListProps = {
  attachments: readonly AttachmentListItem[]
  onRemove?: (attachment: AttachmentListItem) => void
  emptyMessage?: string
  className?: string
}

export function AttachmentList({
  attachments,
  onRemove,
  emptyMessage = "No attachments.",
  className,
}: AttachmentListProps) {
  if (attachments.length === 0) {
    return <p data-slot="attachment-list" className={cn("text-sm text-muted-foreground", className)}>{emptyMessage}</p>
  }

  return (
    <ul data-slot="attachment-list" role="list" className={cn("grid w-full min-w-0 gap-2", className)}>
      {attachments.map((attachment) => (
        <li key={attachment.id} className="min-w-0">
          <Attachment className="w-full min-w-0 flex-nowrap">
            <AttachmentMedia variant={attachment.thumbnailUrl ? "image" : "icon"}>
              {attachment.thumbnailUrl ? (
                <img src={attachment.thumbnailUrl} alt="" loading="lazy" />
              ) : <FileIcon aria-hidden />}
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle title={attachment.name}>{attachment.name}</AttachmentTitle>
              {attachment.description && <AttachmentDescription>{attachment.description}</AttachmentDescription>}
            </AttachmentContent>
            {(attachment.downloadUrl || onRemove) && (
              <AttachmentActions>
                {attachment.downloadUrl && (
                  <a
                    href={attachment.downloadUrl}
                    download={attachment.name}
                    className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                    aria-label={`Download ${attachment.name}`}
                  >
                    <DownloadIcon aria-hidden />
                  </a>
                )}
                {onRemove && (
                  <AttachmentAction
                    type="button"
                    aria-label={`Remove ${attachment.name}`}
                    size="icon-sm"
                    onClick={() => onRemove(attachment)}
                  >
                    <XIcon aria-hidden />
                  </AttachmentAction>
                )}
              </AttachmentActions>
            )}
          </Attachment>
        </li>
      ))}
    </ul>
  )
}
