import { X } from "lucide-react"
import { type ComponentPropsWithoutRef, useEffect, useRef, useState } from "react"

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
  form: formId,
  onChange,
  onClear,
  readOnly,
  value,
  ...props
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "")
  const hasValue = String(value ?? uncontrolledValue) !== ""

  useEffect(() => {
    const input = inputRef.current
    const form = input?.form
    if (isControlled || !input || !form) return

    let resetTimer: ReturnType<typeof setTimeout> | undefined
    const handleReset = () => {
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => setUncontrolledValue(input.value), 0)
    }

    form.addEventListener("reset", handleReset)
    return () => {
      form.removeEventListener("reset", handleReset)
      clearTimeout(resetTimer)
    }
  }, [formId, isControlled])

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
        form={formId}
        onChange={(event) => {
          if (!isControlled) setUncontrolledValue(event.currentTarget.value)
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
