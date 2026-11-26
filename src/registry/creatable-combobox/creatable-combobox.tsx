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

export type CreatableComboboxProps = {
  id?: string
  options: ComboboxOption[]
  selectedOptions?: ComboboxOption[]
  searchValue?: string
  onSearchChange?: (query: string) => void
  loading?: boolean
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
} & (
  | { multiple?: false; value: string; onValueChange: (value: string) => void }
  | { multiple: true; value: string[]; onValueChange: (value: string[]) => void }
)

const CUSTOM_VALUE = "\u0000creatable-custom-value"

export function CreatableCombobox({
  id,
  options,
  selectedOptions,
  searchValue,
  onSearchChange,
  loading = false,
  multiple,
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
  const [localQuery, setLocalQuery] = useState("")
  const query = onSearchChange ? searchValue ?? localQuery : localQuery
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const highlightedValueRef = useRef<string | undefined>(undefined)

  const filteredOptions = useMemo(() => {
    if (onSearchChange) return options
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return options.filter((option) =>
      option.label.toLocaleLowerCase().includes(normalizedQuery),
    )
  }, [onSearchChange, options, query])

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
  function getSelectedLabel(value: string) {
    return (
      options.find((option) => option.value === value)?.label ??
      selectedOptions?.find((option) => option.value === value)?.label ??
      value
    )
  }

  function setQuery(nextQuery: string) {
    if (!onSearchChange || searchValue === undefined) setLocalQuery(nextQuery)
    if (nextQuery !== query) onSearchChange?.(nextQuery)
  }

  function handleValueChange(nextValue: string | string[] | null) {
    if (multiple) {
      if (Array.isArray(nextValue)) {
        if (!nextValue.includes(CUSTOM_VALUE)) {
          onValueChange(nextValue)
        } else if (!value.includes(trimmedQuery)) {
          onValueChange([...value, trimmedQuery])
        }
      }
      return
    }
    if (typeof nextValue === "string") {
      onValueChange(nextValue === CUSTOM_VALUE ? trimmedQuery : nextValue)
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
    if (event.nativeEvent.isComposing || event.keyCode === 229) {
      event.preventBaseUIHandler?.()
      return
    }
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

    const nextValue = exactMatch?.value ?? trimmedQuery
    if (multiple) {
      if (!value.includes(nextValue)) onValueChange([...value, nextValue])
      setQuery("")
    } else {
      handleValueChange(nextValue)
    }
  }

  const selectedLabel = multiple ? "" : getSelectedLabel(value)
  const trigger = (
    <ComboboxTrigger
      id={id}
      ref={triggerRef}
      render={
        <Button
          className={cn("w-full justify-between font-normal", !multiple && className)}
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
  )

  return (
    <Combobox<string, boolean>
      disabled={disabled}
      filter={null}
      inputValue={query}
      multiple={multiple}
      onInputValueChange={(nextQuery, { reason }) => {
        if (!onSearchChange || reason === "input-change" || reason === "input-clear") {
          setQuery(nextQuery)
        }
      }}
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
      {multiple ? (
        <div className={className}>
          {trigger}
          {value.length > 0 && (
            <ul aria-label="Selected options" className="mt-1 flex flex-wrap gap-1">
              {value.map((item) => {
                const label = getSelectedLabel(item)
                return (
                  <li key={item} className="min-w-0 max-w-full">
                    <Button
                      aria-label={`Remove ${label}`}
                      className="max-w-full"
                      disabled={disabled}
                      onClick={() => {
                        triggerRef.current?.focus()
                        onValueChange(value.filter((selected) => selected !== item))
                      }}
                      size="xs"
                      type="button"
                      variant="secondary"
                    >
                      <span className="truncate">{label}</span>
                      <X />
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : trigger}
      <ComboboxContent aria-label={searchPlaceholder} className="w-(--anchor-width)">
        {onCreateNew ? (
          <Button
            className="m-1 w-[calc(100%-0.5rem)] justify-start"
            onClick={() => {
              if (multiple || onSearchChange) setQuery("")
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
          onChange={onSearchChange ? undefined : (event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={searchPlaceholder}
          showClear={false}
          showTrigger={false}
          {...(!onSearchChange ? { value: query } : {})}
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
        {loading ? (
          <div role="status" className="py-2 text-center text-muted-foreground text-sm">
            Loading…
          </div>
        ) : filteredOptions.length === 0 && !showCustomValue ? (
          <div className="py-2 text-center text-muted-foreground text-sm">
            {emptyText}
          </div>
        ) : null}
      </ComboboxContent>
    </Combobox>
  )
}
