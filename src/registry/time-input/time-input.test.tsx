import { fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { DateTimeInput, TimeInput } from "./time-input"

function changedValues(onChange: ReturnType<typeof vi.fn>) {
  return onChange.mock.calls.map(([event]) => event.target.value)
}

describe("TimeInput", () => {
  it("normalizes valid 24-hour entry and marks incomplete entry on blur", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TimeInput
        aria-label="Time"
        defaultValue=""
        onChange={onChange}
        picker={false}
      />,
    )
    const input = screen.getByLabelText("Time")

    await user.type(input, "9:30")
    expect(changedValues(onChange)).toEqual(["09:30"])
    fireEvent.blur(input)
    expect(input).toHaveValue("09:30")

    await user.clear(input)
    await user.type(input, "13:")
    expect(input).not.toHaveAttribute("aria-invalid", "true")
    fireEvent.blur(input)
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("accepts 12-hour entry and emits canonical 24-hour values", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TimeInput
        aria-label="Time"
        defaultValue="13:45"
        onChange={onChange}
        picker={false}
        timeFormat="12h"
      />,
    )
    const input = screen.getByLabelText("Time")

    expect(input).toHaveValue("1:45 PM")
    await user.clear(input)
    await user.type(input, "12:05 am")
    expect(changedValues(onChange)).toContain("00:05")
    fireEvent.blur(input)
    expect(input).toHaveValue("12:05 AM")
  })

  it("marks impossible manual entry invalid", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TimeInput
        aria-label="Time"
        defaultValue=""
        onChange={onChange}
        picker={false}
      />,
    )
    const input = screen.getByLabelText("Time")

    await user.type(input, "25:00")
    fireEvent.blur(input)
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(onChange).not.toHaveBeenCalled()
  })

  it("opens a 12-hour picker and emits canonical selections", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TimeInput
        aria-label="Time"
        defaultValue="13:45"
        onChange={onChange}
        timeFormat="12h"
      />,
    )
    const input = screen.getByLabelText("Time")
    const body = within(document.body)

    await user.click(screen.getByRole("button", { name: "Open time picker" }))
    await user.click(await body.findByRole("button", { name: "Hour 3" }))
    await user.click(body.getByRole("button", { name: "Minute 30" }))
    await user.click(body.getByRole("button", { name: "AM" }))

    expect(changedValues(onChange)).toEqual(["15:45", "15:30", "03:30"])
    expect(input).toHaveValue("3:30 AM")
  })

  it("opens a 24-hour picker with seconds", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TimeInput
        aria-label="Time"
        defaultValue="13:45:30"
        onChange={onChange}
        seconds
      />,
    )
    const body = within(document.body)

    await user.click(screen.getByRole("button", { name: "Open time picker" }))
    await user.click(await body.findByRole("button", { name: "Hour 09" }))
    await user.click(body.getByRole("button", { name: "Minute 15" }))
    await user.click(body.getByRole("button", { name: "Second 05" }))

    expect(changedValues(onChange)).toEqual(["09:45:30", "09:15:30", "09:15:05"])
  })

  it("moves picker selection with arrow keys", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TimeInput
        aria-label="Time"
        defaultValue="13:45"
        onChange={onChange}
      />,
    )
    const body = within(document.body)

    await user.click(screen.getByRole("button", { name: "Open time picker" }))
    const hour13 = await body.findByRole("button", { name: "Hour 13" })
    fireEvent.keyDown(hour13, { key: "ArrowDown" })

    expect(changedValues(onChange)).toEqual(["14:45"])
    expect(document.activeElement).toHaveTextContent("14")
  })

  it("keeps uncontrolled time valid when the display format changes", () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <TimeInput
        aria-label="Time"
        defaultValue="13:45"
        onChange={onChange}
        picker={false}
        timeFormat="12h"
      />,
    )
    const input = screen.getByLabelText("Time")
    expect(input).toHaveValue("1:45 PM")

    rerender(
      <TimeInput
        aria-label="Time"
        defaultValue="13:45"
        onChange={onChange}
        picker={false}
        timeFormat="24h"
      />,
    )
    expect(input).toHaveValue("13:45")
  })

  it("disables the picker for read-only input", () => {
    render(<TimeInput aria-label="Time" defaultValue="13:45" readOnly />)

    expect(screen.getByLabelText("Time")).toHaveAttribute("readonly")
    expect(
      screen.getByRole("button", { name: "Open time picker" }),
    ).toBeDisabled()
  })

  it("restores the controlled value when the parent rejects a valid edit", () => {
    const onChange = vi.fn()
    render(
      <TimeInput
        aria-label="Time"
        onChange={onChange}
        picker={false}
        value="13:45"
      />,
    )
    const input = screen.getByLabelText("Time")

    fireEvent.change(input, { target: { value: "14:30" } })
    expect(changedValues(onChange)).toEqual(["14:30"])
    expect(input).toHaveValue("13:45")
  })
})

describe("DateTimeInput", () => {
  it("keeps the canonical datetime when the 12-hour picker changes time", async () => {
    const user = userEvent.setup()

    function Harness() {
      const [value, setValue] = useState("2026-11-22T13:45:00")
      return (
        <DateTimeInput
          seconds
          timeFormat="12h"
          timeProps={{ "aria-label": "Time" }}
          value={value}
          onChange={setValue}
        />
      )
    }

    render(<Harness />)
    const input = screen.getByLabelText("Time")
    const body = within(document.body)

    expect(input).toHaveValue("1:45:00 PM")
    await user.click(screen.getByRole("button", { name: "Open time picker" }))
    await user.click(await body.findByRole("button", { name: "Hour 3" }))

    expect(input).toHaveValue("3:45:00 PM")
  })
})
