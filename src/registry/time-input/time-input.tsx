import { useCallback, useEffect, useRef, useState } from "react"
import type {
  ChangeEvent,
  ComponentProps,
  FocusEvent,
  ReactNode,
  Ref,
} from "react"
import { Clock } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export type TimeFormat = "12h" | "24h"

type TimeInputProps = Omit<
  ComponentProps<"input">,
  "defaultValue" | "ref" | "type" | "value"
> & {
  defaultValue?: string
  picker?: boolean
  ref?: Ref<HTMLInputElement>
  seconds?: boolean
  timeFormat?: TimeFormat
  value?: string
}

type ParsedTime = {
  status: "empty" | "incomplete" | "invalid" | "valid"
  value?: string
}

type TimeParts = {
  hour: number
  minute: number
  second: number | null
}

const TIME_24H = /^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/
const TIME_12H = /^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?\s*([AaPp])\.?[Mm]\.?$/
const CANONICAL_TIME = /^(\d{2}):(\d{2})(?::(\d{2}))?$/

function pad2(value: number) {
  return String(value).padStart(2, "0")
}

function canonicalTime(hour: number, minute: number, second: number | null) {
  return `${pad2(hour)}:${pad2(minute)}${second == null ? "" : `:${pad2(second)}`}`
}

function partialNumber(
  part: string,
  {
    max,
    min = 0,
    singleDigitMax,
  }: { max: number; min?: number; singleDigitMax: number },
) {
  if (part === "") return true
  if (!/^\d{1,2}$/.test(part)) return false
  const value = Number(part)
  if (part.length === 1) return value <= singleDigitMax
  return value >= min && value <= max
}

function potentialClock(
  text: string,
  {
    hourMax,
    hourMin = 0,
    seconds,
  }: { hourMax: number; hourMin?: number; seconds: boolean },
) {
  const parts = text.split(":")
  if (parts.length > (seconds ? 3 : 2)) return false
  const [hour, minute, second] = parts
  if (
    !partialNumber(hour ?? "", {
      max: hourMax,
      min: hourMin,
      singleDigitMax: 9,
    })
  ) {
    return false
  }
  if (
    minute !== undefined &&
    !partialNumber(minute, { max: 59, singleDigitMax: 5 })
  ) {
    return false
  }
  if (second !== undefined) {
    if (!seconds) return false
    if (!partialNumber(second, { max: 59, singleDigitMax: 5 })) return false
  }
  return true
}

function potentialTime(text: string, timeFormat: TimeFormat, seconds: boolean) {
  if (timeFormat === "24h") {
    return potentialClock(text, { hourMax: 23, seconds })
  }

  const firstLetter = text.search(/[A-Za-z]/)
  const clock = (firstLetter === -1 ? text : text.slice(0, firstLetter)).trim()
  const meridiem = firstLetter === -1 ? "" : text.slice(firstLetter)
  const meridiemKey = meridiem.toLowerCase().replace(/[.\s]/g, "")
  if (!["", "a", "am", "p", "pm"].includes(meridiemKey)) return false
  return potentialClock(clock, { hourMax: 12, hourMin: 1, seconds })
}

function parseTimeText(
  text: string,
  timeFormat: TimeFormat,
  seconds: boolean,
): ParsedTime {
  const trimmed = text.trim()
  if (trimmed === "") return { status: "empty" }

  const match =
    timeFormat === "12h" ? TIME_12H.exec(trimmed) : TIME_24H.exec(trimmed)
  if (match) {
    const hasSeconds = match[3] !== undefined
    if (hasSeconds && !seconds) return { status: "invalid" }

    const hour = Number(match[1])
    const minute = Number(match[2])
    const second = hasSeconds ? Number(match[3]) : null

    if (timeFormat === "12h") {
      if (hour < 1 || hour > 12) return { status: "invalid" }
      const pm = match[4]?.toLowerCase() === "p"
      return {
        status: "valid",
        value: canonicalTime(hour % 12 + (pm ? 12 : 0), minute, second),
      }
    }

    if (hour > 23) return { status: "invalid" }
    return { status: "valid", value: canonicalTime(hour, minute, second) }
  }

  return {
    status: potentialTime(trimmed, timeFormat, seconds)
      ? "incomplete"
      : "invalid",
  }
}

function parseCanonicalTime(value: string): TimeParts | null {
  const match = CANONICAL_TIME.exec(value)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  const second = match[3] == null ? null : Number(match[3])
  if (hour > 23 || minute > 59 || (second != null && second > 59)) return null
  return { hour, minute, second }
}

function formatTime(value: string, timeFormat: TimeFormat) {
  const parts = parseCanonicalTime(value)
  if (!parts) return value

  const time = `${pad2(parts.hour)}:${pad2(parts.minute)}${
    parts.second == null ? "" : `:${pad2(parts.second)}`
  }`
  if (timeFormat === "24h") return time

  const hour12 = parts.hour % 12 || 12
  const meridiem = parts.hour >= 12 ? "PM" : "AM"
  return `${hour12}:${pad2(parts.minute)}${
    parts.second == null ? "" : `:${pad2(parts.second)}`
  } ${meridiem}`
}

function normalizeValue(
  value: string,
  timeFormat: TimeFormat,
  seconds: boolean,
): { canonical: string; display: string; invalid: boolean } {
  if (value === "") return { canonical: "", display: "", invalid: false }

  const as24 = parseTimeText(value, "24h", seconds)
  if (as24.status === "valid" && as24.value) {
    return {
      canonical: as24.value,
      display: formatTime(as24.value, timeFormat),
      invalid: false,
    }
  }

  if (timeFormat === "12h") {
    const as12 = parseTimeText(value, "12h", seconds)
    if (as12.status === "valid" && as12.value) {
      return {
        canonical: as12.value,
        display: formatTime(as12.value, timeFormat),
        invalid: false,
      }
    }
  }

  return { canonical: "", display: value, invalid: true }
}

function inputPattern(timeFormat: TimeFormat, seconds: boolean) {
  if (timeFormat === "12h") {
    return seconds
      ? "^(?:0?[1-9]|1[0-2]):[0-5]\\d(?::[0-5]\\d)?\\s*[AaPp]\\.?[Mm]\\.?$"
      : "^(?:0?[1-9]|1[0-2]):[0-5]\\d\\s*[AaPp]\\.?[Mm]\\.?$"
  }
  return seconds
    ? "^(?:[01]?\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?$"
    : "^(?:[01]?\\d|2[0-3]):[0-5]\\d$"
}

function inputPlaceholder(timeFormat: TimeFormat, seconds: boolean) {
  if (timeFormat === "12h") return seconds ? "h:mm:ss AM" : "h:mm AM"
  return seconds ? "HH:mm:ss" : "HH:mm"
}

function inputMaxLength(timeFormat: TimeFormat, seconds: boolean) {
  if (timeFormat === "12h") return seconds ? 13 : 10
  return seconds ? 8 : 5
}

function proxyInputValue(input: HTMLInputElement, value: string) {
  return new Proxy(input, {
    get(target, property) {
      if (property === "value") return value
      const result = Reflect.get(target, property, target)
      return typeof result === "function" ? result.bind(target) : result
    },
  })
}

function changeEventWithValue(
  value: string,
  input: HTMLInputElement | null,
  nativeEvent?: Event,
) {
  const target = input
    ? proxyInputValue(input, value)
    : ({ value } as HTMLInputElement)
  const event = nativeEvent ?? new Event("change", { bubbles: true })
  return {
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    currentTarget: target,
    defaultPrevented: false,
    eventPhase: event.eventPhase,
    isDefaultPrevented: () => false,
    isPersistent: () => true,
    isPropagationStopped: () => false,
    isTrusted: false,
    nativeEvent: event,
    persist: () => {},
    preventDefault: () => {},
    stopPropagation: () => {},
    target,
    timeStamp: Date.now(),
    type: event.type || "change",
  } as unknown as ChangeEvent<HTMLInputElement>
}

function currentTimeCanonical(seconds: boolean) {
  const now = new Date()
  return canonicalTime(
    now.getHours(),
    now.getMinutes(),
    seconds ? now.getSeconds() : null,
  )
}

function pickerParts(value: string, seconds: boolean) {
  const parts =
    parseCanonicalTime(value) ?? parseCanonicalTime(currentTimeCanonical(seconds))
  if (!parts) {
    return { hour: 0, hour12: 12, meridiem: "AM" as const, minute: 0, second: 0 }
  }
  return {
    hour: parts.hour,
    hour12: parts.hour % 12 || 12,
    meridiem: (parts.hour >= 12 ? "PM" : "AM") as "AM" | "PM",
    minute: parts.minute,
    second: parts.second ?? 0,
  }
}

function pickerTime(
  hour: number,
  minute: number,
  second: number,
  seconds: boolean,
) {
  return canonicalTime(hour, minute, seconds ? second : null)
}

function PickerColumn({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div
      aria-label={label}
      className="flex max-h-52 w-12 flex-col gap-0.5 overflow-y-auto"
      role="group"
    >
      {children}
    </div>
  )
}

function PickerButton({
  label,
  onClick,
  selected,
  tabIndex,
  children,
}: {
  label: string
  onClick: () => void
  selected: boolean
  tabIndex: number
  children: ReactNode
}) {
  return (
    <Button
      aria-label={label}
      aria-pressed={selected}
      className="w-full"
      onClick={onClick}
      size="xs"
      tabIndex={tabIndex}
      type="button"
      variant={selected ? "secondary" : "ghost"}
    >
      {children}
    </Button>
  )
}

function TimePickerContent({
  onSelect,
  seconds,
  timeFormat,
  value,
}: {
  onSelect: (value: string) => void
  seconds: boolean
  timeFormat: TimeFormat
  value: string
}) {
  const parts = pickerParts(value, seconds)
  const hours = Array.from(
    { length: timeFormat === "12h" ? 12 : 24 },
    (_, index) => (timeFormat === "12h" ? index + 1 : index),
  )
  const minutes = Array.from({ length: 60 }, (_, index) => index)

  const selectHour = (hour: number) => {
    const hour24 =
      timeFormat === "12h"
        ? hour % 12 + (parts.meridiem === "PM" ? 12 : 0)
        : hour
    onSelect(pickerTime(hour24, parts.minute, parts.second, seconds))
  }

  const selectMeridiem = (meridiem: "AM" | "PM") => {
    onSelect(
      pickerTime(
        parts.hour12 % 12 + (meridiem === "PM" ? 12 : 0),
        parts.minute,
        parts.second,
        seconds,
      ),
    )
  }

  return (
    <PopoverContent align="start" className="w-auto p-2">
      <PopoverHeader className="px-1">
        <PopoverTitle className="text-muted-foreground text-xs">
          Select time
        </PopoverTitle>
      </PopoverHeader>
      <div className="flex gap-1">
        <PickerColumn label="Hour">
          {hours.map((hour) => {
            const selected =
              timeFormat === "12h" ? parts.hour12 === hour : parts.hour === hour
            return (
              <PickerButton
                key={hour}
                label={`Hour ${timeFormat === "12h" ? hour : pad2(hour)}`}
                onClick={() => selectHour(hour)}
                selected={selected}
                tabIndex={selected ? 0 : -1}
              >
                {timeFormat === "12h" ? hour : pad2(hour)}
              </PickerButton>
            )
          })}
        </PickerColumn>
        <PickerColumn label="Minute">
          {minutes.map((minute) => {
            const selected = parts.minute === minute
            return (
              <PickerButton
                key={minute}
                label={`Minute ${pad2(minute)}`}
                onClick={() =>
                  onSelect(pickerTime(parts.hour, minute, parts.second, seconds))
                }
                selected={selected}
                tabIndex={selected ? 0 : -1}
              >
                {pad2(minute)}
              </PickerButton>
            )
          })}
        </PickerColumn>
        {seconds ? (
          <PickerColumn label="Second">
            {minutes.map((second) => {
              const selected = parts.second === second
              return (
                <PickerButton
                  key={second}
                  label={`Second ${pad2(second)}`}
                  onClick={() =>
                    onSelect(
                      pickerTime(parts.hour, parts.minute, second, seconds),
                    )
                  }
                  selected={selected}
                  tabIndex={selected ? 0 : -1}
                >
                  {pad2(second)}
                </PickerButton>
              )
            })}
          </PickerColumn>
        ) : null}
        {timeFormat === "12h" ? (
          <PickerColumn label="Meridiem">
            {(["AM", "PM"] as const).map((meridiem) => {
              const selected = parts.meridiem === meridiem
              return (
                <PickerButton
                  key={meridiem}
                  label={meridiem}
                  onClick={() => selectMeridiem(meridiem)}
                  selected={selected}
                  tabIndex={selected ? 0 : -1}
                >
                  {meridiem}
                </PickerButton>
              )
            })}
          </PickerColumn>
        ) : null}
      </div>
    </PopoverContent>
  )
}

/** Time entry with optional 12-hour display and a popup picker. */
export function TimeInput({
  className,
  defaultValue,
  disabled = false,
  onBlur,
  onChange,
  picker = true,
  ref,
  seconds = false,
  timeFormat = "24h",
  value,
  ...props
}: TimeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [initial] = useState(() =>
    normalizeValue(value ?? defaultValue ?? "", timeFormat, seconds),
  )
  const [canonical, setCanonical] = useState(initial.canonical)
  const [text, setText] = useState(initial.display)
  const [invalid, setInvalid] = useState(initial.invalid)

  useEffect(() => {
    if (value === undefined) return
    const next = normalizeValue(value, timeFormat, seconds)
    setCanonical(next.canonical)
    setInvalid(next.invalid)
    setText((currentText) => {
      const current = parseTimeText(currentText, timeFormat, seconds)
      if (
        next.canonical !== "" &&
        current.status === "valid" &&
        current.value === next.canonical
      ) {
        return currentText
      }
      if (next.canonical === "" && current.status === "empty") return currentText
      return next.display
    })
  }, [seconds, timeFormat, value])

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      const cleanup = typeof ref === "function" ? ref(node) : undefined
      if (ref && typeof ref !== "function") ref.current = node
      return () => {
        inputRef.current = null
        if (typeof cleanup === "function") cleanup()
        else if (typeof ref === "function") ref(null)
        else if (ref) ref.current = null
      }
    },
    [ref],
  )

  const commitCanonical = (nextCanonical: string, nativeEvent?: Event) => {
    setCanonical(nextCanonical)
    setInvalid(false)
    onChange?.(
      changeEventWithValue(nextCanonical, inputRef.current, nativeEvent),
    )
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextText = event.target.value
    setText(nextText)
    const parsed = parseTimeText(nextText, timeFormat, seconds)
    if (parsed.status === "valid" && parsed.value) {
      commitCanonical(parsed.value, event.nativeEvent)
    } else if (parsed.status === "empty") {
      commitCanonical("", event.nativeEvent)
    } else {
      setInvalid(parsed.status === "invalid")
    }
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const parsed = parseTimeText(text, timeFormat, seconds)
    if (parsed.status === "valid" && parsed.value) {
      setCanonical(parsed.value)
      setInvalid(false)
      setText(formatTime(parsed.value, timeFormat))
    } else if (parsed.status === "empty") {
      setCanonical("")
      setInvalid(false)
      setText("")
    } else {
      setInvalid(true)
    }
    onBlur?.(event)
  }

  const inputProps = {
    ...props,
    "aria-invalid": invalid ? true : props["aria-invalid"],
    autoComplete: "off",
    disabled,
    dir: "ltr" as const,
    maxLength: inputMaxLength(timeFormat, seconds),
    onBlur: handleBlur,
    onChange: handleChange,
    pattern: inputPattern(timeFormat, seconds),
    placeholder: inputPlaceholder(timeFormat, seconds),
    ref: setRefs,
    type: "text" as const,
    value: text,
  }

  if (!picker) {
    return <Input className={className} {...inputProps} />
  }

  return (
    <Popover>
      <InputGroup className={cn("w-full", className)}>
        <InputGroupInput {...inputProps} />
        <InputGroupAddon align="inline-end">
          <PopoverTrigger
            aria-label="Open time picker"
            disabled={disabled}
            render={<InputGroupButton size="icon-xs" variant="ghost" />}
          >
            <Clock />
          </PopoverTrigger>
        </InputGroupAddon>
      </InputGroup>
      <TimePickerContent
        onSelect={(nextCanonical) => {
          setText(formatTime(nextCanonical, timeFormat))
          commitCanonical(nextCanonical)
        }}
        seconds={seconds}
        timeFormat={timeFormat}
        value={canonical || currentTimeCanonical(seconds)}
      />
    </Popover>
  )
}

/**
 * Date picker + time entry sharing one canonical `YYYY-MM-DDTHH:mm(:ss)` value,
 * matching what `input[type=datetime-local]` produced. Either part may be
 * blank mid-edit; the value joins them with `T` (or is empty when both are).
 */
export function DateTimeInput({
  dateProps,
  onChange,
  picker,
  seconds = false,
  timeFormat = "24h",
  timeProps,
  value,
}: {
  dateProps?: Omit<ComponentProps<"input">, "type" | "value" | "onChange">
  onChange: (value: string) => void
  picker?: boolean
  seconds?: boolean
  timeFormat?: TimeFormat
  timeProps?: Omit<
    ComponentProps<"input">,
    "defaultValue" | "type" | "value" | "onChange"
  >
  value: string
}) {
  const [date = "", time = ""] = value.split("T")
  const shortTime = time.slice(0, seconds ? 8 : 5)
  const join = (nextDate: string, nextTime: string) =>
    onChange(
      nextDate === "" && nextTime === "" ? "" : `${nextDate}T${nextTime}`,
    )
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Input
        {...dateProps}
        type="date"
        value={date}
        onChange={(event) => join(event.target.value, shortTime)}
      />
      <TimeInput
        aria-label="Time"
        {...timeProps}
        picker={picker}
        seconds={seconds}
        timeFormat={timeFormat}
        value={shortTime}
        onChange={(event) => join(date, event.target.value)}
      />
    </div>
  )
}
