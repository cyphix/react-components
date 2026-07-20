import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from '@/components/ui/native-select'
import { StateGrid } from '@/internal/state-grid'

export function NativeSelectShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <NativeSelect defaultValue="apple">
              <NativeSelectOption value="apple">Apple</NativeSelectOption>
              <NativeSelectOption value="banana">Banana</NativeSelectOption>
              <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
            </NativeSelect>
          ),
        },
        {
          label: 'size: sm',
          node: (
            <NativeSelect size="sm" defaultValue="apple">
              <NativeSelectOption value="apple">Apple</NativeSelectOption>
              <NativeSelectOption value="banana">Banana</NativeSelectOption>
            </NativeSelect>
          ),
        },
        {
          label: 'with optgroup',
          node: (
            <NativeSelect defaultValue="carrot">
              <NativeSelectOptGroup label="Fruits">
                <NativeSelectOption value="apple">Apple</NativeSelectOption>
                <NativeSelectOption value="banana">Banana</NativeSelectOption>
              </NativeSelectOptGroup>
              <NativeSelectOptGroup label="Vegetables">
                <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
                <NativeSelectOption value="potato">Potato</NativeSelectOption>
              </NativeSelectOptGroup>
            </NativeSelect>
          ),
        },
        {
          label: 'disabled',
          node: (
            <NativeSelect disabled defaultValue="apple">
              <NativeSelectOption value="apple">Apple</NativeSelectOption>
            </NativeSelect>
          ),
        },
        {
          label: 'invalid',
          node: (
            <NativeSelect aria-invalid defaultValue="apple">
              <NativeSelectOption value="apple">Apple</NativeSelectOption>
              <NativeSelectOption value="banana">Banana</NativeSelectOption>
            </NativeSelect>
          ),
        },
      ]}
    />
  )
}
