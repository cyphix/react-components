import { FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { StateGrid } from '@/internal/state-grid'

export function ItemShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <div className="w-64">
              <Item>
                <ItemContent>
                  <ItemTitle>Basic item</ItemTitle>
                  <ItemDescription>A short description.</ItemDescription>
                </ItemContent>
              </Item>
            </div>
          ),
        },
        {
          label: 'outline',
          node: (
            <div className="w-64">
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Outlined item</ItemTitle>
                  <ItemDescription>With a visible border.</ItemDescription>
                </ItemContent>
              </Item>
            </div>
          ),
        },
        {
          label: 'muted',
          node: (
            <div className="w-64">
              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>Muted item</ItemTitle>
                  <ItemDescription>Subtle background fill.</ItemDescription>
                </ItemContent>
              </Item>
            </div>
          ),
        },
        {
          label: 'with media + actions',
          node: (
            <div className="w-64">
              <Item variant="outline">
                <ItemMedia variant="icon">
                  <FileText />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>report.pdf</ItemTitle>
                  <ItemDescription>1.2 MB</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="sm">
                    Open
                  </Button>
                </ItemActions>
              </Item>
            </div>
          ),
        },
        {
          label: 'size: sm',
          node: (
            <div className="w-64">
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>Compact item</ItemTitle>
                </ItemContent>
              </Item>
            </div>
          ),
        },
      ]}
    />
  )
}
