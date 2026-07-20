import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StateGrid } from '@/internal/state-grid'

export function LabelShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <Label>Your email address</Label> },
        {
          label: 'with input',
          node: (
            <div className="grid w-64 gap-2">
              <Label htmlFor="label-showcase-email">Email</Label>
              <Input id="label-showcase-email" placeholder="Email address" />
            </div>
          ),
        },
        {
          label: 'with checkbox',
          node: (
            <div className="flex items-center gap-2">
              <Checkbox id="label-showcase-terms" />
              <Label htmlFor="label-showcase-terms">Accept terms</Label>
            </div>
          ),
        },
        {
          label: 'disabled peer',
          node: (
            <div className="grid w-64 gap-2">
              <Label htmlFor="label-showcase-disabled">Disabled field</Label>
              <Input
                id="label-showcase-disabled"
                placeholder="Disabled"
                disabled
                className="peer"
              />
            </div>
          ),
        },
      ]}
    />
  )
}
