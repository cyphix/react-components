import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
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
  onCreateNew?: (query: string) => void
  createLabel?: string
  className?: string
  disabled?: boolean
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
  onCreateNew,
  createLabel = "Create new…",
  disabled = false,
  className,
}: CreatableComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

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
  const hasExactMatch = options.some(
    (option) =>
      option.label.toLocaleLowerCase() === trimmedQuery.toLocaleLowerCase(),
  )
  const showCustomValue = allowCustom && trimmedQuery !== "" && !hasExactMatch
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

  return (
    <Combobox
      disabled={disabled}
      filter={null}
      onInputValueChange={setQuery}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setQuery("")
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
      <ComboboxContent className="w-(--anchor-width)">
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
          placeholder={searchPlaceholder}
          showClear={false}
          showTrigger={false}
          value={query}
        />
        <ComboboxList>
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
