import { X } from "lucide-react"
import { type ComponentPropsWithoutRef, useRef, useState } from "react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export type TextInputProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  clearable?: boolean
  onClear?: () => void
}

export function TextInput({
  className,
  clearable = false,
  defaultValue,
  disabled,
  onChange,
  onClear,
  readOnly,
  value,
  ...props
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "")
  const hasValue = String(value ?? uncontrolledValue) !== ""

  function clear() {
    const input = inputRef.current
    const view = input?.ownerDocument.defaultView
    if (!input || !view) return

    // Use the native setter so React observes the input event as a change.
    const setValue = Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, "value")?.set
    setValue?.call(input, "")
    input.dispatchEvent(new view.Event("input", { bubbles: true }))
    onClear?.()
    input.focus()
  }

  return (
    <InputGroup className={className}>
      <InputGroupInput
        {...props}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={(event) => {
          if (value === undefined) setUncontrolledValue(event.currentTarget.value)
          onChange?.(event)
        }}
        readOnly={readOnly}
        ref={inputRef}
        type="text"
        value={value}
      />
      {clearable && hasValue && !disabled && !readOnly && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Clear" onClick={clear} size="icon-xs">
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
