import type { DragEndEvent } from "@dnd-kit/core"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from "@/registry/sortable/sortable"

const dnd = vi.hoisted(() => ({
  onDragEnd: undefined as ((event: DragEndEvent) => void) | undefined,
}))

vi.mock("@dnd-kit/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@dnd-kit/core")>()
  return {
    ...actual,
    DndContext: (props: React.ComponentProps<typeof actual.DndContext>) => {
      dnd.onDragEnd = props.onDragEnd
      return <actual.DndContext {...props} />
    },
  }
})

afterEach(cleanup)

const items = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
  { id: "c", label: "Gamma" },
]

function renderList(onReorder = vi.fn()) {
  render(
    <SortableList items={items} getId={(item) => item.id} onReorder={onReorder}>
      {items.map((item) => (
        <SortableItem key={item.id} id={item.id}>
          <SortableHandle aria-label={`Reorder ${item.label}`} />
          {item.label}
        </SortableItem>
      ))}
    </SortableList>
  )
  return onReorder
}

function drop(active: string, over: string | null) {
  dnd.onDragEnd?.({
    active: { id: active },
    over: over ? { id: over } : null,
  } as DragEndEvent)
}

describe("Sortable", () => {
  it("renders an accessible drag handle per item", () => {
    renderList()
    const handle = screen.getByRole("button", { name: "Reorder Beta" })
    expect(handle).toHaveAttribute("aria-roledescription", "sortable")
    expect(handle).toHaveAttribute("data-slot", "sortable-handle")
  })

  it("calls onReorder with the moved items", () => {
    const onReorder = renderList()
    drop("c", "a")
    expect(onReorder).toHaveBeenCalledWith([items[2], items[0], items[1]])
  })

  it("ignores drops outside the list or onto the same item", () => {
    const onReorder = renderList()
    drop("a", null)
    drop("b", "b")
    expect(onReorder).not.toHaveBeenCalled()
  })

  it("disables the handle of a disabled item", () => {
    render(
      <SortableList items={items} getId={(item) => item.id} onReorder={vi.fn()}>
        <SortableItem id="a" disabled>
          <SortableHandle aria-label="Reorder Alpha" disabled />
        </SortableItem>
      </SortableList>
    )
    expect(screen.getByRole("button", { name: "Reorder Alpha" })).toBeDisabled()
  })

  it("throws when a handle is rendered outside an item", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<SortableHandle aria-label="Orphan" />)).toThrow(
      "SortableHandle must be used within a SortableItem"
    )
  })
})
