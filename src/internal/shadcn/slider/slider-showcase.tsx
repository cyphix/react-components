import { Slider } from '@/components/ui/slider'
import { StateGrid } from '@/internal/state-grid'

export function SliderShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: <Slider className="w-64" defaultValue={[50]} />,
        },
        {
          label: 'range',
          node: <Slider className="w-64" defaultValue={[25, 75]} />,
        },
        {
          label: 'stepped',
          node: <Slider className="w-64" defaultValue={[40]} step={20} />,
        },
        {
          label: 'disabled',
          node: <Slider className="w-64" defaultValue={[30]} disabled />,
        },
      ]}
    />
  )
}
