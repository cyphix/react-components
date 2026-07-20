import { CalendarIcon } from 'lucide-react'

import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker'
import { StateGrid } from '@/internal/state-grid'

export function MarkerShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <div className="w-64">
              <Marker>
                <MarkerContent>Today at 9:41 AM</MarkerContent>
              </Marker>
            </div>
          ),
        },
        {
          label: 'separator',
          node: (
            <div className="w-64">
              <Marker variant="separator">
                <MarkerContent>Yesterday</MarkerContent>
              </Marker>
            </div>
          ),
        },
        {
          label: 'border',
          node: (
            <div className="w-64">
              <Marker variant="border">
                <MarkerContent>Unread messages</MarkerContent>
              </Marker>
            </div>
          ),
        },
        {
          label: 'with icon',
          node: (
            <div className="w-64">
              <Marker>
                <MarkerIcon>
                  <CalendarIcon />
                </MarkerIcon>
                <MarkerContent>March 14, 2026</MarkerContent>
              </Marker>
            </div>
          ),
        },
      ]}
    />
  )
}
