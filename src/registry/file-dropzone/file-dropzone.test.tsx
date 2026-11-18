import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { FileDropzone } from "./file-dropzone"

describe("FileDropzone", () => {
  it("opens the picker from the keyboard and accepts the same file again", async () => {
    const onFilesSelected = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<FileDropzone accept=".png" onFilesSelected={onFilesSelected} />)
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    const open = vi.spyOn(input, "click")
    const file = new File(["test"], "photo.png", { type: "image/png" })

    await user.tab()
    expect(screen.getByRole("button", { name: "Choose files" })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(open).toHaveBeenCalledOnce()
    await user.upload(input, file)
    await user.upload(input, file)
    expect(onFilesSelected.mock.calls).toEqual([[[file]], [[file]]])
  })

  it("selects valid dropped files and reports type, size, and count rejections", () => {
    const onFilesSelected = vi.fn()
    const onFilesRejected = vi.fn()
    const { container } = render(
      <FileDropzone
        accept=" image/*, .PDF, text/plain "
        multiple
        maxFiles={3}
        maxBytes={4}
        onFilesSelected={onFilesSelected}
        onFilesRejected={onFilesRejected}
      />,
    )
    const dropzone = container.querySelector('[data-slot="file-dropzone"]')!
    const invalid = new File(["test"], "script.js", { type: "text/javascript" })
    const large = new File(["large"], "large.jpg", { type: "image/jpeg" })
    const image = new File(["test"], "photo.png", { type: "image/png" })
    const pdf = new File(["test"], "report.PDF")
    const text = new File(["test"], "notes.txt", { type: "text/plain" })
    const extra = new File(["test"], "extra.gif", { type: "image/gif" })
    const dataTransfer = { types: ["Files"], files: [invalid, image, large, pdf, text, extra] }

    fireEvent.dragEnter(dropzone, { dataTransfer })
    expect(dropzone).toHaveAttribute("data-dragging")
    expect(fireEvent.drop(dropzone, { dataTransfer })).toBe(false)
    expect(dropzone).not.toHaveAttribute("data-dragging")
    expect(onFilesSelected).toHaveBeenCalledWith([image, pdf, text])
    expect(onFilesRejected).toHaveBeenCalledWith([
      { file: invalid, reason: "invalid-type" },
      { file: large, reason: "too-large" },
      { file: extra, reason: "too-many-files" },
    ])
  })

  it("prevents the browser opening dropped files while disabled", () => {
    const onFilesSelected = vi.fn()
    const onFilesRejected = vi.fn()
    const { container } = render(<FileDropzone disabled {...{ onFilesSelected, onFilesRejected }} />)
    const dropzone = container.querySelector('[data-slot="file-dropzone"]')!
    const dataTransfer = { types: ["Files"], files: [new File([], "file")] }

    fireEvent.dragEnter(dropzone, { dataTransfer })
    expect(dropzone).not.toHaveAttribute("data-dragging")
    expect(fireEvent.drop(dropzone, { dataTransfer })).toBe(false)
    expect(screen.getByRole("button", { name: "Choose files" })).toBeDisabled()
    expect(onFilesSelected).not.toHaveBeenCalled()
    expect(onFilesRejected).not.toHaveBeenCalled()
  })
})
