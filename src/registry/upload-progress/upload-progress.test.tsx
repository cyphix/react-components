import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { UploadProgress } from "./upload-progress"

describe("UploadProgress", () => {
  it("shows determinate transfer progress and indeterminate server processing", () => {
    const { rerender } = render(<UploadProgress fileName="photo.png" state="uploading" uploadPercent={41.6} />)
    const upload = () => screen.getByRole("progressbar", { name: "Upload progress for photo.png" })
    const processing = () => screen.getByRole("progressbar", { name: "Server processing progress for photo.png" })
    expect(upload()).toHaveAttribute("aria-valuenow", "42")
    expect(processing()).toHaveAttribute("aria-valuenow", "0")
    expect(screen.getByText("42%")).toBeVisible()

    rerender(<UploadProgress fileName="photo.png" state="processing" />)
    expect(upload()).toHaveAttribute("aria-valuenow", "100")
    expect(processing()).not.toHaveAttribute("aria-valuenow")
    expect(screen.getByRole("status")).toHaveTextContent("Processing…")

    rerender(<UploadProgress fileName="photo.png" state="processing" processingPercent={35} />)
    expect(upload()).toHaveAttribute("aria-valuenow", "100")
    expect(processing()).toHaveAttribute("aria-valuenow", "35")

    rerender(<UploadProgress fileName="photo.png" state="complete" />)
    expect(upload()).toHaveAttribute("aria-valuenow", "100")
    expect(processing()).toHaveAttribute("aria-valuenow", "100")
    expect(screen.getByRole("status")).toHaveTextContent("Upload complete")
  })

  it("offers cancel and retry only in the appropriate states", async () => {
    const onCancel = vi.fn()
    const onRetry = vi.fn()
    const props = { fileName: "photo.png", onCancel, onRetry }
    const user = userEvent.setup()
    const { rerender } = render(<UploadProgress {...props} state="uploading" />)

    expect(screen.getByRole("progressbar", { name: "Upload progress for photo.png" })).not.toHaveAttribute("aria-valuenow")
    expect(screen.queryByRole("button", { name: /retry/i })).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Cancel upload of photo.png" }))
    expect(onCancel).toHaveBeenCalledOnce()

    rerender(<UploadProgress {...props} state="error" errorMessage="Connection lost." />)
    expect(screen.getByRole("status")).toHaveTextContent("Connection lost.")
    expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Retry upload of photo.png" }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
