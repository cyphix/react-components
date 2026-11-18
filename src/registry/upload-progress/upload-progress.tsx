"use client"

import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export type UploadProgressProps = {
  fileName: string
  state: "uploading" | "processing" | "complete" | "error"
  uploadPercent?: number
  processingPercent?: number
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

function normalizePercent(percent: number | undefined) {
  return percent !== undefined && Number.isFinite(percent)
    ? Math.round(Math.max(0, Math.min(100, percent)))
    : null
}

function ProgressMeter({
  label,
  fileName,
  value,
  active,
  className,
}: {
  label: string
  fileName: string
  value: number | null
  active: boolean
  className: string
}) {
  return (
    <div className="grid gap-1">
      <div className="flex justify-between gap-2 text-xs text-muted-foreground" aria-hidden>
        <span>{label}</span>
        {value !== null && <span className="tabular-nums">{value}%</span>}
      </div>
      <Progress
        value={value}
        aria-label={`${label} progress for ${fileName}`}
        className={cn(
          className,
          active && value === null &&
            "[&_[data-slot=progress-indicator]]:w-full [&_[data-slot=progress-indicator]]:opacity-50 motion-safe:[&_[data-slot=progress-indicator]]:animate-pulse",
        )}
      />
    </div>
  )
}

export function UploadProgress({
  fileName,
  state,
  uploadPercent,
  processingPercent,
  errorMessage,
  onCancel,
  onRetry,
  className,
}: UploadProgressProps) {
  const active = state === "uploading" || state === "processing"
  const uploaded = state === "processing" || state === "complete" ? 100 : normalizePercent(uploadPercent)
  const processed = state === "complete" ? 100 : state === "uploading" ? 0 : normalizePercent(processingPercent)

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
      <ProgressMeter
        label="Upload"
        fileName={fileName}
        value={uploaded}
        active={state === "uploading"}
        className="[&_[data-slot=progress-indicator]]:bg-green-600 dark:[&_[data-slot=progress-indicator]]:bg-green-500"
      />
      <ProgressMeter
        label="Server processing"
        fileName={fileName}
        value={processed}
        active={state === "processing"}
        className="[&_[data-slot=progress-indicator]]:bg-blue-600 dark:[&_[data-slot=progress-indicator]]:bg-blue-400"
      />
    </div>
  )
}
