import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { StateGrid } from '@/internal/state-grid'

export function RadioGroupShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <RadioGroup defaultValue="comfortable">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="default" id="radio-showcase-r1" />
                <Label htmlFor="radio-showcase-r1">Default</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="comfortable" id="radio-showcase-r2" />
                <Label htmlFor="radio-showcase-r2">Comfortable</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="compact" id="radio-showcase-r3" />
                <Label htmlFor="radio-showcase-r3">Compact</Label>
              </div>
            </RadioGroup>
          ),
        },
        {
          label: 'disabled',
          node: (
            <RadioGroup defaultValue="one" disabled>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="one" id="radio-showcase-d1" />
                <Label htmlFor="radio-showcase-d1">Option one</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="two" id="radio-showcase-d2" />
                <Label htmlFor="radio-showcase-d2">Option two</Label>
              </div>
            </RadioGroup>
          ),
        },
        {
          label: 'disabled item',
          node: (
            <RadioGroup defaultValue="a">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="a" id="radio-showcase-m1" />
                <Label htmlFor="radio-showcase-m1">Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="b" id="radio-showcase-m2" disabled />
                <Label htmlFor="radio-showcase-m2">Unavailable</Label>
              </div>
            </RadioGroup>
          ),
        },
      ]}
    />
  )
}
