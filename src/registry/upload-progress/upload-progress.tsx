"use client"

import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export type UploadProgressProps = {
  fileName: string
  state: "uploading" | "processing" | "complete" | "error"
  percent?: number
  errorMessage?: string
  onCancel?: () => void
  onRetry?: () => void
  className?: string
}

const statusLabels = {
  uploading: "Uploading…",
  processing: "Processing…",
  complete: "Upload complete",
  error: "Upload failed",
}

export function UploadProgress({
  fileName,
  state,
  percent,
  errorMessage,
  onCancel,
  onRetry,
  className,
}: UploadProgressProps) {
  const active = state === "uploading" || state === "processing"
  const value = state === "uploading" && percent !== undefined && Number.isFinite(percent)
    ? Math.round(Math.max(0, Math.min(100, percent)))
    : null

  return (
    <div data-slot="upload-progress" className={cn("grid w-full min-w-0 gap-2 rounded-lg border p-3", className)}>
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium" title={fileName}>{fileName}</p>
          <p role="status" className={cn("text-xs text-muted-foreground", state === "error" && "text-destructive")}>
            {state === "error" && errorMessage ? errorMessage : statusLabels[state]}
          </p>
        </div>
        {active && onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} aria-label={`Cancel upload of ${fileName}`}>
            Cancel
          </Button>
        )}
        {state === "error" && onRetry && (
          <Button type="button" variant="outline" size="sm" onClick={onRetry} aria-label={`Retry upload of ${fileName}`}>
            Retry
          </Button>
        )}
      </div>
      {active && (
        <div className="flex items-center gap-2">
          <Progress
            value={value}
            aria-label={`Upload progress for ${fileName}`}
            className={cn("min-w-0 flex-1", value === null && "[&_[data-slot=progress-indicator]]:w-full [&_[data-slot=progress-indicator]]:opacity-50 motion-safe:[&_[data-slot=progress-indicator]]:animate-pulse")}
          />
          {value !== null && <span className="text-xs text-muted-foreground tabular-nums" aria-hidden>{value}%</span>}
        </div>
      )}
    </div>
  )
}
