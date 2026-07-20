import { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StateGrid } from '@/internal/state-grid'

export function SelectShowcase() {
  const [fruit, setFruit] = useState('apple')

  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <Select value={fruit} onValueChange={setFruit}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
              </SelectContent>
            </Select>
          ),
        },
        {
          label: 'grouped',
          node: (
            <Select>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select food" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Vegetables</SelectLabel>
                  <SelectItem value="carrot">Carrot</SelectItem>
                  <SelectItem value="potato">Potato</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ),
        },
        {
          label: 'size: sm',
          node: (
            <Select>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
              </SelectContent>
            </Select>
          ),
        },
        {
          label: 'disabled',
          node: (
            <Select disabled>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
              </SelectContent>
            </Select>
          ),
        },
      ]}
    />
  )
}
