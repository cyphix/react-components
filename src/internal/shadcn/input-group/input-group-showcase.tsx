import { SearchIcon } from 'lucide-react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { StateGrid } from '@/internal/state-grid'

export function InputGroupShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'icon addon',
          node: (
            <div className="w-64">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput placeholder="Search..." />
              </InputGroup>
            </div>
          ),
        },
        {
          label: 'text addon',
          node: (
            <div className="w-64">
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="example.com" />
              </InputGroup>
            </div>
          ),
        },
        {
          label: 'with button',
          node: (
            <div className="w-64">
              <InputGroup>
                <InputGroupInput placeholder="Enter a URL" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton>Copy</InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          ),
        },
        {
          label: 'with textarea',
          node: (
            <div className="w-64">
              <InputGroup>
                <InputGroupTextarea placeholder="Send a message..." />
                <InputGroupAddon align="block-end">
                  <InputGroupButton>Send</InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          ),
        },
      ]}
    />
  )
}
