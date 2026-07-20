import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { StateGrid } from '@/internal/state-grid'

export function CheckboxShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <Checkbox /> },
        { label: 'checked', node: <Checkbox defaultChecked /> },
        { label: 'disabled', node: <Checkbox disabled /> },
        {
          label: 'disabled checked',
          node: <Checkbox disabled defaultChecked />,
        },
        { label: 'invalid', node: <Checkbox aria-invalid /> },
        {
          label: 'with label',
          node: (
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox-showcase-terms" />
              <Label htmlFor="checkbox-showcase-terms">
                Accept terms and conditions
              </Label>
            </div>
          ),
        },
      ]}
    />
  )
}
