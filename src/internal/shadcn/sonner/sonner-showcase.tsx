import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { StateGrid } from '@/internal/state-grid'

export function SonnerShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <Button
              variant="outline"
              onClick={() => toast('Event has been created')}
            >
              Show toast
            </Button>
          ),
        },
        {
          label: 'success',
          node: (
            <Button
              variant="outline"
              onClick={() => toast.success('Changes saved successfully')}
            >
              Success
            </Button>
          ),
        },
        {
          label: 'error',
          node: (
            <Button
              variant="outline"
              onClick={() => toast.error('Something went wrong')}
            >
              Error
            </Button>
          ),
        },
        {
          label: 'warning',
          node: (
            <Button
              variant="outline"
              onClick={() => toast.warning('Storage is almost full')}
            >
              Warning
            </Button>
          ),
        },
        {
          label: 'info',
          node: (
            <Button
              variant="outline"
              onClick={() => toast.info('A new version is available')}
            >
              Info
            </Button>
          ),
        },
        {
          label: 'description + action',
          node: (
            <Button
              variant="outline"
              onClick={() =>
                toast('Event has been created', {
                  description: 'Sunday, July 19th at 8:45 PM',
                  action: {
                    label: 'Undo',
                    onClick: () => toast.info('Undone'),
                  },
                })
              }
            >
              With action
            </Button>
          ),
        },
      ]}
    />
  )
}
