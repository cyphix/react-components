import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { StateGrid } from '@/internal/state-grid'

export function FieldShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'vertical',
          node: (
            <div className="w-64">
              <Field>
                <FieldLabel htmlFor="field-showcase-name">Name</FieldLabel>
                <Input id="field-showcase-name" placeholder="Your name" />
                <FieldDescription>
                  Displayed on your public profile.
                </FieldDescription>
              </Field>
            </div>
          ),
        },
        {
          label: 'horizontal',
          node: (
            <div className="w-64">
              <Field orientation="horizontal">
                <Checkbox id="field-showcase-updates" />
                <FieldLabel htmlFor="field-showcase-updates">
                  Email me updates
                </FieldLabel>
              </Field>
            </div>
          ),
        },
        {
          label: 'with error',
          node: (
            <div className="w-64">
              <Field data-invalid>
                <FieldLabel htmlFor="field-showcase-email">Email</FieldLabel>
                <Input
                  id="field-showcase-email"
                  aria-invalid
                  defaultValue="not-an-email"
                />
                <FieldError>Enter a valid email address.</FieldError>
              </Field>
            </div>
          ),
        },
      ]}
    />
  )
}
