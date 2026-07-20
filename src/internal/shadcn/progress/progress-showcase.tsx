import { Progress } from '@/components/ui/progress'
import { StateGrid } from '@/internal/state-grid'

export function ProgressShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'empty', node: <Progress className="w-64" value={0} /> },
        { label: '33%', node: <Progress className="w-64" value={33} /> },
        { label: '66%', node: <Progress className="w-64" value={66} /> },
        { label: 'complete', node: <Progress className="w-64" value={100} /> },
      ]}
    />
  )
}
