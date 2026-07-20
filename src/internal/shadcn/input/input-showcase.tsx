import { Input } from '@/components/ui/input'
import { StateGrid } from '@/internal/state-grid'

export function InputShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: <Input className="w-64" placeholder="Email address" />,
        },
        {
          label: 'with value',
          node: <Input className="w-64" defaultValue="hello@example.com" />,
        },
        {
          label: 'disabled',
          node: <Input className="w-64" placeholder="Disabled" disabled />,
        },
        {
          label: 'invalid',
          node: (
            <Input className="w-64" aria-invalid defaultValue="not-an-email" />
          ),
        },
        {
          label: 'type: password',
          node: (
            <Input
              className="w-64"
              type="password"
              defaultValue="hunter2hunter2"
            />
          ),
        },
        {
          label: 'type: file',
          node: <Input className="w-64" type="file" />,
        },
      ]}
    />
  )
}
