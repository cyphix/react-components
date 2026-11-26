import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  type ComboboxOption,
  CreatableCombobox,
} from "@/registry/creatable-combobox/creatable-combobox"

afterEach(cleanup)

const options: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "pear", label: "Pear" },
]

function renderCombobox(
  props: Partial<React.ComponentProps<typeof CreatableCombobox>> = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <CreatableCombobox
        onValueChange={vi.fn()}
        options={options}
        placeholder="Choose a fruit"
        value=""
        {...props}
      />
    </QueryClientProvider>,
  )
}

async function openCombobox() {
  await userEvent.click(screen.getByRole("combobox"))
  return screen.findByRole("combobox", { name: "Search…" })
}

describe("CreatableCombobox", () => {
  it("hides the clear button when search is empty", async () => {
    renderCombobox({ clearable: true })
    await openCombobox()
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument()
  })

  it("does not show a clear button by default even with search text", async () => {
    renderCombobox()
    const search = await openCombobox()
    await userEvent.type(search, "ap")
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument()
  })

  it("clears only search, restores options and keeps focus and keyboard navigation", async () => {
    const onValueChange = vi.fn()
    renderCombobox({ clearable: true, value: "pear", onValueChange })
    const search = await openCombobox()
    await userEvent.type(search, "ap")
    expect(screen.queryByRole("option", { name: "Pear" })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }))
    expect(search).toHaveValue("")
    expect(search).toHaveFocus()
    expect(search).toBeVisible()
    expect(screen.getByRole("option", { name: "Pear" })).toBeVisible()
    expect(screen.getByRole("option", { name: "Apple" })).toBeVisible()
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument()
    expect(onValueChange).not.toHaveBeenCalled()
    await userEvent.type(search, "ap")
    await userEvent.keyboard("{ArrowDown}{Enter}")
    expect(onValueChange).toHaveBeenCalledWith("apple")
  })

  it("clears a query with no matches", async () => {
    renderCombobox({ clearable: true })
    const search = await openCombobox()
    await userEvent.type(search, "unknown")
    expect(screen.getByText("No options found.")).toBeVisible()
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }))
    expect(screen.queryByText("No options found.")).not.toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Apple" })).toBeVisible()
    expect(search).toHaveFocus()
  })

  it("shows a free-form value that is not in options", () => {
    renderCombobox({ value: "Dragonfruit" })
    expect(screen.getByRole("combobox")).toHaveTextContent("Dragonfruit")
  })

  it("merges className into the trigger", () => {
    renderCombobox({ className: "w-64" })
    expect(screen.getByRole("combobox")).toHaveClass("w-64", "justify-between")
  })

  it("hides empty text when a custom value is offered", async () => {
    renderCombobox({ allowCustom: true })
    const search = await openCombobox()
    await userEvent.type(search, "dragonfruit")
    expect(await screen.findByRole("option", { name: 'Use "dragonfruit"' })).toBeVisible()
    expect(screen.queryByText("No options found.")).not.toBeInTheDocument()
  })

  it("filters options as the user types", async () => {
    renderCombobox()
    const search = await openCombobox()
    await userEvent.type(search, "ap")

    expect(await screen.findByRole("option", { name: "Apple" })).toBeVisible()
    expect(
      screen.queryByRole("option", { name: "Pear" }),
    ).not.toBeInTheDocument()
  })

  it("hides the empty text when options match", async () => {
    renderCombobox()
    const search = await openCombobox()
    await userEvent.type(search, "ap")

    expect(await screen.findByRole("option", { name: "Apple" })).toBeVisible()
    expect(screen.queryByText("No options found.")).not.toBeInTheDocument()
  })

  it("shows the empty text when nothing matches and custom values are disabled", async () => {
    renderCombobox()
    const search = await openCombobox()
    await userEvent.type(search, "dragonfruit")

    expect(await screen.findByText("No options found.")).toBeVisible()
  })

  it("offers an unmatched custom value and selects its trimmed query", async () => {
    const onValueChange = vi.fn()
    renderCombobox({ allowCustom: true, onValueChange })
    const search = await openCombobox()
    await userEvent.type(search, "  foo  ")

    await userEvent.click(
      await screen.findByRole("option", { name: 'Use "foo"' }),
    )
    expect(onValueChange).toHaveBeenCalledWith("foo")
  })

  it("does not offer a custom value for an exact-case match", async () => {
    renderCombobox({ allowCustom: true })
    const search = await openCombobox()
    await userEvent.type(search, "Apple")

    expect(screen.getByRole("option", { name: "Apple" })).toBeVisible()
    expect(
      screen.queryByRole("option", { name: /Use/ }),
    ).not.toBeInTheDocument()
  })

  it("offers a custom value for a case-distinct match while suggesting the existing option", async () => {
    const onValueChange = vi.fn()
    renderCombobox({ allowCustom: true, onValueChange })
    const search = await openCombobox()
    await userEvent.type(search, "aPpLe")

    expect(screen.getByRole("option", { name: "Apple" })).toBeVisible()
    await userEvent.click(
      await screen.findByRole("option", { name: 'Use "aPpLe"' }),
    )
    expect(onValueChange).toHaveBeenCalledWith("aPpLe")
  })

  it("renders create new above search and passes its query to the callback", async () => {
    const onCreateNew = vi.fn()
    renderCombobox({ onCreateNew })
    const search = await openCombobox()
    await userEvent.type(search, "custom value")
    const createButton = screen.getByRole("button", { name: "Create new…" })

    expect(
      createButton.compareDocumentPosition(search) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await userEvent.click(createButton)
    expect(onCreateNew).toHaveBeenCalledWith("custom value")
  })

  it("does not render create new when no callback is provided", async () => {
    renderCombobox()
    await openCombobox()

    expect(
      screen.queryByRole("button", { name: "Create new…" }),
    ).not.toBeInTheDocument()
  })

  describe("createOnEnter", () => {
    it("hides the Use option row even when allowCustom is also true", async () => {
      renderCombobox({ allowCustom: true, createOnEnter: true })
      const search = await openCombobox()
      await userEvent.type(search, "dragonfruit")

      expect(
        screen.queryByRole("option", { name: /Use/ }),
      ).not.toBeInTheDocument()
      expect(screen.getByText("No options found.")).toBeVisible()
    })

    it("creates the trimmed typed text on Enter when nothing matches", async () => {
      const onValueChange = vi.fn()
      renderCombobox({ createOnEnter: true, onValueChange })
      const search = await openCombobox()
      await userEvent.type(search, "  dragonfruit  {Enter}")

      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(onValueChange).toHaveBeenCalledWith("dragonfruit")
      expect(
        screen.queryByRole("combobox", { name: "Search…" }),
      ).not.toBeInTheDocument()
    })

    it("creates partial text on Enter when no option is highlighted", async () => {
      const onValueChange = vi.fn()
      renderCombobox({ createOnEnter: true, onValueChange })
      const search = await openCombobox()
      await userEvent.type(search, "ap{Enter}")

      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(onValueChange).toHaveBeenCalledWith("ap")
    })

    it("selects the exact trimmed case-sensitive option on Enter", async () => {
      const onValueChange = vi.fn()
      renderCombobox({ createOnEnter: true, onValueChange })
      const search = await openCombobox()
      await userEvent.type(search, "  Apple  {Enter}")

      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(onValueChange).toHaveBeenCalledWith("apple")
    })

    it("creates a new value on Enter when casing differs from an existing option", async () => {
      const onValueChange = vi.fn()
      renderCombobox({ createOnEnter: true, onValueChange })
      const search = await openCombobox()
      await userEvent.type(search, "aPpLe{Enter}")

      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(onValueChange).toHaveBeenCalledWith("aPpLe")
    })

    it("picks the highlighted option on Enter when navigated with arrow keys", async () => {
      const onValueChange = vi.fn()
      renderCombobox({ createOnEnter: true, onValueChange })
      const search = await openCombobox()
      await userEvent.type(search, "ap")
      await userEvent.keyboard("{ArrowDown}{Enter}")

      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(onValueChange).toHaveBeenCalledWith("apple")
    })

    it("does not create a value on Enter when the query is empty or whitespace", async () => {
      const onValueChange = vi.fn()
      renderCombobox({ createOnEnter: true, onValueChange })
      const search = await openCombobox()
      await userEvent.type(search, "   {Enter}")

      expect(onValueChange).not.toHaveBeenCalled()
    })

    it("never creates a value on typing, pasting, blur, Tab, Escape, or IME composition", async () => {
      const onValueChange = vi.fn()
      renderCombobox({ createOnEnter: true, onValueChange })

      const search = await openCombobox()
      await userEvent.type(search, "que")
      expect(onValueChange).not.toHaveBeenCalled()

      await userEvent.click(document.body)
      expect(onValueChange).not.toHaveBeenCalled()

      const search2 = await openCombobox()
      await userEvent.click(search2)
      await userEvent.paste("pasted-tag")
      expect(search2).toHaveValue("pasted-tag")
      expect(onValueChange).not.toHaveBeenCalled()

      await userEvent.keyboard("{Tab}")
      expect(onValueChange).not.toHaveBeenCalled()

      const search3 = await openCombobox()
      await userEvent.type(search3, "draft")
      await userEvent.keyboard("{Escape}")
      expect(onValueChange).not.toHaveBeenCalled()

      const search4 = await openCombobox()
      await userEvent.type(search4, "ap")
      fireEvent.keyDown(search4, {
        key: "Enter",
        isComposing: true,
      })
      expect(onValueChange).not.toHaveBeenCalled()

      await userEvent.keyboard("{ArrowDown}")
      fireEvent.keyDown(search4, {
        key: "Enter",
        isComposing: true,
      })
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it("cancels Enter default action and does not submit an enclosing form", async () => {
      const onValueChange = vi.fn()
      const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })
      render(
        <QueryClientProvider client={queryClient}>
          <form onSubmit={onSubmit}>
            <CreatableCombobox
              createOnEnter
              onValueChange={onValueChange}
              options={options}
              placeholder="Choose a fruit"
              value=""
            />
            <button type="submit">Save</button>
          </form>
        </QueryClientProvider>,
      )

      // Enter with new custom value
      const search1 = await openCombobox()
      await userEvent.type(search1, "dragonfruit")
      expect(fireEvent.keyDown(search1, { key: "Enter" })).toBe(false)
      expect(onValueChange).toHaveBeenLastCalledWith("dragonfruit")
      expect(onSubmit).not.toHaveBeenCalled()

      // Enter with exact match
      const search2 = await openCombobox()
      await userEvent.type(search2, "Apple")
      expect(fireEvent.keyDown(search2, { key: "Enter" })).toBe(false)
      expect(onValueChange).toHaveBeenLastCalledWith("apple")
      expect(onSubmit).not.toHaveBeenCalled()

      // Enter with highlighted option
      const search3 = await openCombobox()
      await userEvent.type(search3, "pe")
      await userEvent.keyboard("{ArrowDown}")
      expect(fireEvent.keyDown(search3, { key: "Enter" })).toBe(false)
      expect(onValueChange).toHaveBeenLastCalledWith("pear")
      expect(onSubmit).not.toHaveBeenCalled()

      // Enter with empty query
      const search4 = await openCombobox()
      expect(fireEvent.keyDown(search4, { key: "Enter" })).toBe(false)
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })
})
