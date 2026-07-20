import { FolderOpen, Inbox } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { StateGrid } from '@/internal/state-grid'

export function EmptyShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <div className="w-64">
              <Empty className="border p-6 md:p-6">
                <EmptyHeader>
                  <EmptyTitle>No results</EmptyTitle>
                  <EmptyDescription>
                    Try adjusting your search filters.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ),
        },
        {
          label: 'icon media',
          node: (
            <div className="w-64">
              <Empty className="border p-6 md:p-6">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Inbox />
                  </EmptyMedia>
                  <EmptyTitle>Inbox empty</EmptyTitle>
                  <EmptyDescription>
                    New messages will appear here.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ),
        },
        {
          label: 'with action',
          node: (
            <div className="w-64">
              <Empty className="border p-6 md:p-6">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderOpen />
                  </EmptyMedia>
                  <EmptyTitle>No projects</EmptyTitle>
                  <EmptyDescription>
                    Create your first project to get started.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button size="sm">Create project</Button>
                </EmptyContent>
              </Empty>
            </div>
          ),
        },
      ]}
    />
  )
}
