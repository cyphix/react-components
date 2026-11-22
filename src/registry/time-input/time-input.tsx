import type { ComponentProps } from "react"
import { Input } from "@/components/ui/input"

const TIME_PATTERN = "([01][0-9]|2[0-3]):[0-5][0-9]"

/** 24-hour wall-clock time entry: HH:mm, or HH:mm:ss with `seconds`. */
export function TimeInput({
  seconds,
  ...props
}: Omit<ComponentProps<"input">, "type"> & { seconds?: boolean }) {
  return (
    <Input
      autoComplete="off"
      dir="ltr"
      maxLength={seconds ? 8 : 5}
      pattern={seconds ? `${TIME_PATTERN}(:[0-5][0-9])?` : TIME_PATTERN}
      placeholder={seconds ? "HH:mm:ss" : "HH:mm"}
      type="text"
      {...props}
    />
  )
}

/**
 * Date picker + 24-hour time entry sharing one `YYYY-MM-DDTHH:mm(:ss)` value,
 * matching what `input[type=datetime-local]` produced. Either part may be
 * blank mid-edit; the value joins them with `T` (or is empty when both are).
 */
export function DateTimeInput({
  dateProps,
  onChange,
  seconds,
  timeProps,
  value,
}: {
  dateProps?: Omit<ComponentProps<"input">, "type" | "value" | "onChange">
  onChange: (value: string) => void
  seconds?: boolean
  timeProps?: Omit<ComponentProps<"input">, "type" | "value" | "onChange">
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
        seconds={seconds}
        value={shortTime}
        onChange={(event) => join(date, event.target.value)}
      />
    </div>
  )
}
