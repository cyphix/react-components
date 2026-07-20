import { Badge } from '@/components/ui/badge'
import { StateGrid } from '@/internal/state-grid'

export function BadgeShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <Badge>Badge</Badge> },
        { label: 'secondary', node: <Badge variant="secondary">Badge</Badge> },
        {
          label: 'destructive',
          node: <Badge variant="destructive">Badge</Badge>,
        },
        { label: 'outline', node: <Badge variant="outline">Badge</Badge> },
      ]}
    />
  )
}
