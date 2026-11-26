import { useMemo, useRef, useState } from "react"
import { X } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"

export type ComboboxOption = {
  value: string
  label: string
  group?: string
}

type CreatableComboboxProps = {
  id?: string
  options: ComboboxOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  allowCustom?: boolean
  createOnEnter?: boolean
  onCreateNew?: (query: string) => void
  createLabel?: string
  className?: string
  disabled?: boolean
  clearable?: boolean
}

const CUSTOM_VALUE = "\u0000creatable-custom-value"

export function CreatableCombobox({
  id,
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search…",
  emptyText = "No options found.",
  allowCustom = false,
  createOnEnter = false,
  onCreateNew,
  createLabel = "Create new…",
  disabled = false,
  clearable = false,
  className,
}: CreatableComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const highlightedValueRef = useRef<string | undefined>(undefined)

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [options, query])

  const groupedOptions = useMemo(() => {
    const groups = new Map<string | undefined, ComboboxOption[]>()
    for (const option of filteredOptions) {
      const group = groups.get(option.group) ?? []
      group.push(option)
      groups.set(option.group, group)
    }
    return groups
  }, [filteredOptions])

  const trimmedQuery = query.trim()
  const exactMatch = options.find((option) => option.label === trimmedQuery)
  const showCustomValue =
    allowCustom && !createOnEnter && trimmedQuery !== "" && !exactMatch
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value

  function handleValueChange(nextValue: string | null) {
    if (nextValue === CUSTOM_VALUE) {
      onValueChange(trimmedQuery)
    } else if (nextValue !== null) {
      onValueChange(nextValue)
    }
    setQuery("")
    setOpen(false)
  }

  function handleInputKeyDown(
    event: React.KeyboardEvent<HTMLInputElement> & {
      preventBaseUIHandler?: () => void
    },
  ) {
    if (!createOnEnter || event.key !== "Enter") return
    if (event.nativeEvent.isComposing || event.keyCode === 229) return
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return

    const highlighted = highlightedValueRef.current
    if (
      highlighted !== undefined &&
      filteredOptions.some((option) => option.value === highlighted)
    ) {
      return
    }

    event.preventDefault()
    event.preventBaseUIHandler?.()

    if (trimmedQuery === "") return

    handleValueChange(exactMatch ? exactMatch.value : trimmedQuery)
  }

  return (
    <Combobox
      disabled={disabled}
      filter={null}
      inputValue={query}
      onInputValueChange={setQuery}
      onItemHighlighted={(highlightedValue) => {
        highlightedValueRef.current = highlightedValue
      }}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setQuery("")
        if (!nextOpen) highlightedValueRef.current = undefined
      }}
      onValueChange={handleValueChange}
      open={open}
      value={value || null}
    >
      <ComboboxTrigger
        id={id}
        render={
          <Button
            className={cn("w-full justify-between font-normal", className)}
            variant="outline"
          />
        }
      >
        <span
          className={
            selectedLabel ? "truncate" : "truncate text-muted-foreground"
          }
        >
          {selectedLabel || placeholder}
        </span>
      </ComboboxTrigger>
      <ComboboxContent aria-label={searchPlaceholder} className="w-(--anchor-width)">
        {onCreateNew ? (
          <Button
            className="m-1 w-[calc(100%-0.5rem)] justify-start"
            onClick={() => {
              setOpen(false)
              onCreateNew(query)
            }}
            type="button"
            variant="ghost"
          >
            {createLabel}
          </Button>
        ) : null}
        <ComboboxInput
          aria-label={searchPlaceholder}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={searchPlaceholder}
          showClear={false}
          showTrigger={false}
          value={query}
          ref={inputRef}
        >
          {clearable && query !== "" && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label="Clear search"
                size="icon-xs"
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => {
                  setQuery("")
                  inputRef.current?.focus()
                }}
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </ComboboxInput>
        <ComboboxList aria-label={searchPlaceholder}>
          {Array.from(groupedOptions, ([group, groupOptions]) =>
            group ? (
              <ComboboxGroup key={group}>
                <ComboboxLabel>{group}</ComboboxLabel>
                {groupOptions.map((option) => (
                  <ComboboxItem key={option.value} value={option.value}>
                    {option.label}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            ) : (
              groupOptions.map((option) => (
                <ComboboxItem key={option.value} value={option.value}>
                  {option.label}
                </ComboboxItem>
              ))
            ),
          )}
          {showCustomValue ? (
            <ComboboxItem value={CUSTOM_VALUE}>
              Use &quot;{trimmedQuery}&quot;
            </ComboboxItem>
          ) : null}
        </ComboboxList>
        {filteredOptions.length === 0 && !showCustomValue ? (
          <div className="py-2 text-center text-muted-foreground text-sm">
            {emptyText}
          </div>
        ) : null}
      </ComboboxContent>
    </Combobox>
  )
}
