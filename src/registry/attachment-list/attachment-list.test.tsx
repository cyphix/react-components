import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AttachmentList } from "./attachment-list"

const attachments = [
  { id: "1", name: "photo.png", thumbnailUrl: "/thumb/1", downloadUrl: "/file/1" },
  { id: "2", name: "notes.pdf", description: "Document" },
]

describe("AttachmentList", () => {
  it("shows previews, metadata, and only the available actions", async () => {
    const onRemove = vi.fn()
    const { container } = render(<AttachmentList attachments={attachments} onRemove={onRemove} />)

    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    expect(container.querySelector("img")).toHaveAttribute("src", "/thumb/1")
    expect(screen.getByText("Document")).toBeVisible()
    const download = screen.getByRole("link", { name: "Download photo.png" })
    expect(download).toHaveAttribute("href", "/file/1")
    expect(download).toHaveAttribute("download", "photo.png")
    expect(screen.queryByRole("link", { name: "Download notes.pdf" })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Remove notes.pdf" }))
    expect(onRemove).toHaveBeenCalledWith(attachments[1])
  })

  it("supports read-only and empty lists", () => {
    const { rerender } = render(<AttachmentList attachments={attachments} />)
    expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument()
    rerender(<AttachmentList attachments={[]} emptyMessage="No files added yet." />)
    expect(screen.getByText("No files added yet.")).toBeVisible()
    expect(screen.queryByRole("list")).not.toBeInTheDocument()
  })
})
