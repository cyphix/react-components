import { Textarea } from '@/components/ui/textarea'
import { StateGrid } from '@/internal/state-grid'

export function TextareaShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: <Textarea className="w-64" placeholder="Type your message" />,
        },
        {
          label: 'with value',
          node: (
            <Textarea
              className="w-64"
              defaultValue="This textarea has content already typed in it."
            />
          ),
        },
        {
          label: 'disabled',
          node: <Textarea className="w-64" placeholder="Disabled" disabled />,
        },
        {
          label: 'invalid',
          node: (
            <Textarea
              className="w-64"
              aria-invalid
              placeholder="Invalid field"
            />
          ),
        },
      ]}
    />
  )
}
