import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StateGrid } from '@/internal/state-grid'
import { useListKeyboardNav } from '@/registry/use-list-keyboard-nav/use-list-keyboard-nav'

function SearchableList() {
  const [query, setQuery] = useState('')
  const { inputProps, listProps } = useListKeyboardNav()
  const groups = [
    { name: 'Fruit', items: ['Apple', 'Banana', 'Pear'] },
    { name: 'Vegetables', items: ['Carrot', 'Potato', 'Spinach'] },
  ].map(group => ({ ...group, items: group.items.filter(item => item.toLowerCase().includes(query.toLowerCase())) }))
  return <div className="w-full max-w-sm space-y-3">
    <p className="text-sm text-muted-foreground">Down/Up enters the list. Arrows and Home/End move focus; Space toggles. Type or Backspace to resume searching. Up on the first item returns here.</p>
    <Input {...inputProps} aria-label="Search produce" placeholder="Search produce…" value={query} onChange={e => setQuery(e.target.value)} />
    <div {...listProps} className="max-h-48 space-y-3 overflow-y-auto rounded-md border p-3">
      {groups.filter(group => group.items.length).map(group => <section key={group.name} aria-label={group.name}>
        <h3 className="mb-2 text-sm font-medium">{group.name}</h3>
        {group.items.map(item => <Label key={item} className="flex gap-2 rounded p-2 has-[:focus-visible]:bg-accent">
          <Checkbox data-list-nav-item disabled={item === 'Potato'} />{item}{item === 'Potato' && ' (unavailable)'}
        </Label>)}
      </section>)}
      {!groups.some(group => group.items.length) && <p className="text-sm text-muted-foreground">No matches.</p>}
    </div>
  </div>
}

export function UseListKeyboardNavShowcase() {
  return <StateGrid states={[{ label: 'searchable grouped checkboxes', node: <SearchableList /> }]} />
}
