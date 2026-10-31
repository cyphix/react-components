import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StateGrid } from '@/internal/state-grid'
import {
  CreatableCombobox,
  type ComboboxOption,
} from '@/registry/creatable-combobox/creatable-combobox'

const options: ComboboxOption[] = [
  { value: 'apple', label: 'Apple', group: 'Fruit' },
  { value: 'pear', label: 'Pear', group: 'Fruit' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'pepper', label: 'Pepper', group: 'Vegetables' },
]
const basicOptions = options.map(({ value, label }) => ({ value, label }))

function Example({
  grouped = false,
  allowCustom = false,
  disabled = false,
  empty = false,
}) {
  const [value, setValue] = useState('')
  return (
    <CreatableCombobox
      className="w-56"
      options={empty ? [] : grouped ? options : basicOptions}
      value={value}
      onValueChange={setValue}
      allowCustom={allowCustom}
      disabled={disabled}
    />
  )
}

function CreateNewExample() {
  const [items, setItems] = useState(basicOptions)
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  return (
    <>
      <CreatableCombobox
        className="w-56"
        options={items}
        value={value}
        onValueChange={setValue}
        onCreateNew={(query) => {
          setName(query)
          setOpen(true)
        }}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create an option</DialogTitle>
            <DialogDescription>Add an option and select it immediately.</DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              const label = name.trim()
              if (!label) return
              const existing = items.find((item) => item.label.toLocaleLowerCase() === label.toLocaleLowerCase())
              const nextValue = existing?.value ?? crypto.randomUUID()
              if (!existing) setItems([...items, { value: nextValue, label }])
              setValue(nextValue)
              setOpen(false)
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="new-option-name">Name</Label>
              <Input id="new-option-name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <Button type="submit" disabled={!name.trim()}>Add option</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function CreatableComboboxShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'basic', node: <Example /> },
        { label: 'grouped options', node: <Example grouped /> },
        { label: 'free-form custom values', node: <Example allowCustom /> },
        { label: 'create new', node: <CreateNewExample /> },
        { label: 'disabled', node: <Example disabled /> },
        { label: 'empty options', node: <Example empty /> },
      ]}
    />
  )
}
