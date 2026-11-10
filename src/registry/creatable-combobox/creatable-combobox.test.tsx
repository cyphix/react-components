import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, render, screen } from "@testing-library/react"
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

  it("does not offer a custom value for a case-insensitive exact match", async () => {
    renderCombobox({ allowCustom: true })
    const search = await openCombobox()
    await userEvent.type(search, "aPpLe")

    expect(
      screen.queryByRole("option", { name: /Use/ }),
    ).not.toBeInTheDocument()
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
})
