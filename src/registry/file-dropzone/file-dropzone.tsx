"use client"

import { useId, useRef, useState } from "react"
import { cn } from "cn"
import { UploadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export type FileDropzoneRejection = {
  file: File
  reason: "invalid-type" | "too-large" | "too-many-files"
}

export type FileDropzoneProps = {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxBytes?: number
  disabled?: boolean
  browseLabel?: string
  description?: string
  className?: string
  onFilesSelected: (files: File[]) => void
  onFilesRejected?: (rejections: FileDropzoneRejection[]) => void
}

function acceptsFile(file: File, types: string[]) {
  const name = file.name.toLowerCase()
  const mime = file.type.toLowerCase()
  return types.length === 0 || types.some((type) => {
    if (type.startsWith(".")) return name.endsWith(type)
    if (type.endsWith("/*")) return mime.startsWith(type.slice(0, -1))
    return mime === type
  })
}

export function FileDropzone({
  accept,
  multiple = false,
  maxFiles,
  maxBytes,
  disabled,
  browseLabel = "Choose files",
  description = "Drag and drop files here, or choose them below.",
  className,
  onFilesSelected,
  onFilesRejected,
}: FileDropzoneProps) {
  const input = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)
  const descriptionId = useId()

  function selectFiles(files: FileList | null) {
    if (disabled || !files?.length) return
    const types = (accept ?? "").toLowerCase().split(",").map((type) => type.trim()).filter(Boolean)
    const limit = Math.min(multiple ? Infinity : 1, maxFiles ?? Infinity)
    const selected: File[] = []
    const rejected: FileDropzoneRejection[] = []

    for (const file of Array.from(files)) {
      if (!acceptsFile(file, types)) rejected.push({ file, reason: "invalid-type" })
      else if (maxBytes !== undefined && file.size > maxBytes) rejected.push({ file, reason: "too-large" })
      else if (selected.length >= limit) rejected.push({ file, reason: "too-many-files" })
      else selected.push(file)
    }
    if (selected.length) onFilesSelected(selected)
    if (rejected.length) onFilesRejected?.(rejected)
  }

  return (
    <div
      data-slot="file-dropzone"
      data-dragging={!disabled && dragging ? "" : undefined}
      className={cn(
        "flex w-full min-w-0 flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/25 p-5 text-center transition-colors data-[dragging]:border-primary data-[dragging]:bg-primary/5",
        className,
      )}
      onDragEnter={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        if (!disabled) {
          dragDepth.current++
          setDragging(true)
        }
      }}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes("Files")) return
        event.preventDefault()
        event.dataTransfer.dropEffect = disabled ? "none" : "copy"
      }}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1)
        if (dragDepth.current === 0) setDragging(false)
      }}
      onDrop={(event) => {
        dragDepth.current = 0
        setDragging(false)
        if (!event.dataTransfer.types.includes("Files") && !event.dataTransfer.files.length) return
        event.preventDefault()
        selectFiles(event.dataTransfer.files)
      }}
    >
      <UploadIcon className="size-5 text-muted-foreground" aria-hidden />
      <p id={descriptionId} className="text-sm text-muted-foreground">{description}</p>
      <input
        ref={input}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
          const files = event.currentTarget.files
          selectFiles(files)
          event.currentTarget.value = ""
        }}
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        aria-describedby={descriptionId}
        onClick={() => input.current?.click()}
      >
        {browseLabel}
      </Button>
    </div>
  )
}
