"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  type SortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { GripVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "cn"

type SortableListProps<T> = {
  items: T[]
  getId: (item: T) => UniqueIdentifier
  onReorder: (items: T[]) => void
  strategy?: SortingStrategy
  activationDistance?: number
  children: React.ReactNode
}

/**
 * Drag-and-drop reorderable list (pointer + keyboard). Render each item as a
 * `SortableItem` with a matching id and put a `SortableHandle` inside it.
 */
function SortableList<T>({
  items,
  getId,
  onReorder,
  strategy = rectSortingStrategy,
  activationDistance = 5,
  children,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: activationDistance },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const ids = items.map(getId)
  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return
        onReorder(arrayMove(items, ids.indexOf(active.id), ids.indexOf(over.id)))
      }}
    >
      <SortableContext items={ids} strategy={strategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

type SortableHandleContextValue = Pick<
  ReturnType<typeof useSortable>,
  "attributes" | "listeners" | "setActivatorNodeRef"
>

const SortableHandleContext =
  React.createContext<SortableHandleContextValue | null>(null)

type SortableItemProps = Omit<React.ComponentProps<"div">, "id"> & {
  id: UniqueIdentifier
  disabled?: boolean
}

function SortableItem({
  id,
  disabled,
  ref,
  style,
  children,
  ...props
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })
  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node)
      const cleanup = typeof ref === "function" ? ref(node) : undefined
      if (ref && typeof ref !== "function") ref.current = node
      return () => {
        setNodeRef(null)
        if (typeof cleanup === "function") cleanup()
        else if (typeof ref === "function") ref(null)
        else if (ref) ref.current = null
      }
    },
    [setNodeRef, ref]
  )
  return (
    <div
      {...props}
      data-slot="sortable-item"
      data-dragging={isDragging || undefined}
      ref={setRefs}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        ...style,
      }}
    >
      <SortableHandleContext.Provider
        value={{ attributes, listeners, setActivatorNodeRef }}
      >
        {children}
      </SortableHandleContext.Provider>
    </div>
  )
}

type SortableHandleProps = React.ComponentProps<typeof Button> & {
  "aria-label": string
}

/** Grip button that drags its enclosing `SortableItem`. */
function SortableHandle({
  className,
  size = "icon-xs",
  variant = "ghost",
  children = <GripVertical />,
  ...props
}: SortableHandleProps) {
  const handle = React.useContext(SortableHandleContext)
  if (!handle) {
    throw new Error("SortableHandle must be used within a SortableItem")
  }
  return (
    <Button
      data-slot="sortable-handle"
      {...handle.attributes}
      {...handle.listeners}
      ref={handle.setActivatorNodeRef}
      size={size}
      variant={variant}
      className={cn("cursor-grab touch-none active:cursor-grabbing", className)}
      {...props}
    >
      {children}
    </Button>
  )
}

export {
  SortableHandle,
  SortableItem,
  SortableList,
  type SortableHandleProps,
  type SortableItemProps,
  type SortableListProps,
}
