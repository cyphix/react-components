import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { StateGrid } from '@/internal/state-grid'

export function SwitchShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <Switch /> },
        { label: 'checked', node: <Switch defaultChecked /> },
        { label: 'size: sm', node: <Switch size="sm" /> },
        { label: 'disabled', node: <Switch disabled /> },
        {
          label: 'disabled checked',
          node: <Switch disabled defaultChecked />,
        },
        {
          label: 'with label',
          node: (
            <div className="flex items-center gap-2">
              <Switch id="switch-showcase-airplane" />
              <Label htmlFor="switch-showcase-airplane">Airplane mode</Label>
            </div>
          ),
        },
      ]}
    />
  )
}
