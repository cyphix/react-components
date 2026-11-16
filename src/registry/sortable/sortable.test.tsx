import type { DragEndEvent } from "@dnd-kit/core"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
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

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

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

function stackItemRects(height = 40) {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      const item = this.closest("[data-slot=sortable-item]")
      const index = item
        ? Array.from(item.parentElement?.children ?? []).indexOf(item)
        : 0
      const top = index * height
      return {
        x: 0,
        y: top,
        top,
        left: 0,
        right: 200,
        bottom: top + height,
        width: 200,
        height,
        toJSON: () => ({}),
      } as DOMRect
    }
  )
}

async function pressKey(target: Element | Window, code: string) {
  await act(async () => {
    fireEvent.keyDown(target, { code })
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
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

  it("reorders with the keyboard through the handle", async () => {
    stackItemRects()
    const onReorder = renderList()
    const handle = screen.getByRole("button", { name: "Reorder Alpha" })
    handle.focus()
    await pressKey(handle, "Space")
    await pressKey(handle, "ArrowDown")
    await pressKey(handle, "Space")
    expect(onReorder).toHaveBeenCalledWith([items[1], items[0], items[2]])
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

  it("forwards an item ref while keeping it sortable", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <SortableList items={items} getId={(item) => item.id} onReorder={vi.fn()}>
        <SortableItem id="a" ref={ref} data-testid="item">
          <SortableHandle aria-label="Reorder Alpha" />
        </SortableItem>
      </SortableList>
    )
    expect(ref.current).toBe(screen.getByTestId("item"))
    expect(ref.current).toHaveAttribute("data-slot", "sortable-item")
  })

  it("runs a callback ref's cleanup on unmount", () => {
    const cleanup = vi.fn()
    const ref = vi.fn(() => cleanup)
    const { unmount } = render(
      <SortableList items={items} getId={(item) => item.id} onReorder={vi.fn()}>
        <SortableItem id="a" ref={ref}>
          <SortableHandle aria-label="Reorder Alpha" />
        </SortableItem>
      </SortableList>
    )
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    unmount()
    expect(cleanup).toHaveBeenCalledOnce()
    expect(ref).not.toHaveBeenCalledWith(null)
  })

  it("throws when a handle is rendered outside an item", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<SortableHandle aria-label="Orphan" />)).toThrow(
      "SortableHandle must be used within a SortableItem"
    )
  })
})
