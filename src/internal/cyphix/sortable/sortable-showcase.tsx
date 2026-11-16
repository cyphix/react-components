import { useState } from 'react'
import { verticalListSortingStrategy } from '@dnd-kit/sortable'
import { MoveVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { StateGrid } from '@/internal/state-grid'
import {
  SortableHandle,
  SortableItem,
  SortableList,
} from '@/registry/sortable/sortable'

function ChipsDemo() {
  const [chips, setChips] = useState(['species', 'age', 'height', 'deceased'])
  return (
    <SortableList items={chips} getId={(chip) => chip} onReorder={setChips}>
      <div className="flex flex-wrap gap-1">
        {chips.map((chip) => (
          <SortableItem key={chip} id={chip}>
            <Badge variant="secondary">
              <SortableHandle
                aria-label={`Reorder ${chip}`}
                className="-ml-1.5 size-4 text-muted-foreground"
              />
              {chip}
            </Badge>
          </SortableItem>
        ))}
      </div>
    </SortableList>
  )
}

type Row = { id: string; key: string; value: string }

function RowsDemo() {
  const [rows, setRows] = useState<Row[]>([
    { id: 'r1', key: 'Source', value: 'Artstation' },
    { id: 'r2', key: 'Artist', value: 'Unknown' },
    { id: 'r3', key: 'Year', value: '2024' },
  ])
  return (
    <SortableList
      items={rows}
      getId={(row) => row.id}
      strategy={verticalListSortingStrategy}
      onReorder={setRows}
    >
      <div className="flex w-full flex-col gap-2">
        {rows.map((row) => (
          <SortableItem key={row.id} id={row.id} className="flex items-center gap-2">
            <SortableHandle aria-label={`Reorder ${row.key}`} />
            <Input aria-label="Key" className="h-7" defaultValue={row.key} />
            <Input aria-label="Value" className="h-7" defaultValue={row.value} />
          </SortableItem>
        ))}
      </div>
    </SortableList>
  )
}

function CardsDemo({ disabled = false }: { disabled?: boolean }) {
  const [cards, setCards] = useState(['One', 'Two', 'Three', 'Four'])
  return (
    <SortableList
      items={cards}
      getId={(card) => card}
      activationDistance={6}
      onReorder={setCards}
    >
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <SortableItem
            key={card}
            id={card}
            disabled={disabled}
            className="flex items-center gap-1 rounded-md border bg-muted p-2 text-sm data-dragging:z-10 data-dragging:shadow-md"
          >
            <SortableHandle
              size="icon-sm"
              aria-label={`Reorder ${card}`}
              disabled={disabled}
            />
            {card}
          </SortableItem>
        ))}
      </div>
    </SortableList>
  )
}

function CustomHandleDemo() {
  const [items, setItems] = useState(['First', 'Second', 'Third'])
  return (
    <SortableList
      items={items}
      getId={(item) => item}
      strategy={verticalListSortingStrategy}
      onReorder={setItems}
    >
      <ol className="flex flex-col gap-1">
        {items.map((item) => (
          <SortableItem key={item} id={item}>
            <SortableHandle
              aria-label={`Reorder ${item}`}
              variant="outline"
              size="sm"
            >
              <MoveVertical />
              {item}
            </SortableHandle>
          </SortableItem>
        ))}
      </ol>
    </SortableList>
  )
}

export function SortableShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'chips (wrapping)', node: <ChipsDemo /> },
        { label: 'vertical rows', node: <RowsDemo /> },
        { label: 'card grid', node: <CardsDemo /> },
        { label: 'disabled', node: <CardsDemo disabled /> },
        { label: 'custom handle', node: <CustomHandleDemo /> },
      ]}
    />
  )
}
