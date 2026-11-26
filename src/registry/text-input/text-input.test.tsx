import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it } from "vitest"

import { TextInput } from "./text-input"

afterEach(cleanup)

it("restores Clear when a native reset restores the default text", async () => {
  const user = userEvent.setup()
  render(
    <form>
      <TextInput aria-label="Name" clearable defaultValue="Rosa" />
      <button type="reset">Reset</button>
    </form>,
  )
  const input = screen.getByRole("textbox", { name: "Name" })

  await user.click(screen.getByRole("button", { name: "Clear" }))
  expect(input).toHaveValue("")
  expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument()

  await user.click(screen.getByRole("button", { name: "Reset" }))
  expect(input).toHaveValue("Rosa")
  expect(await screen.findByRole("button", { name: "Clear" })).toBeVisible()
})

it("hides Clear when a native reset restores an empty field", async () => {
  const user = userEvent.setup()
  render(
    <form>
      <TextInput aria-label="Name" clearable />
      <button type="reset">Reset</button>
    </form>,
  )
  const input = screen.getByRole("textbox", { name: "Name" })

  await user.type(input, "Rosa")
  expect(screen.getByRole("button", { name: "Clear" })).toBeVisible()

  await user.click(screen.getByRole("button", { name: "Reset" }))
  expect(input).toHaveValue("")
  await waitFor(() => {
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument()
  })
})
