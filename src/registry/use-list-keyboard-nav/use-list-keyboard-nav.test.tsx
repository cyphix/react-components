import { useState } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { Checkbox } from '@/components/ui/checkbox'
import { useListKeyboardNav } from './use-list-keyboard-nav'

afterEach(cleanup)

function Demo({ names = ['Alpha', 'Disabled', 'Beta'], selector, cancel = false }: {
  names?: string[]; selector?: string; cancel?: boolean
}) {
  const nav = useListKeyboardNav({ itemSelector: selector })
  const [value, setValue] = useState('')
  return <>
    <input aria-label="Search" {...nav.inputProps} value={value} onChange={e => setValue(e.target.value)}
      onKeyDown={e => { if (cancel) e.preventDefault(); nav.inputProps.onKeyDown(e) }} />
    <div {...nav.listProps}>
      {names.map(name => <div key={name}><Checkbox data-list-nav-item aria-label={name} disabled={name === 'Disabled'} /></div>)}
    </div>
  </>
}

it('enters from either end, skips disabled items, moves without wrapping, and returns to input', async () => {
  render(<Demo />)
  const user = userEvent.setup()
  const input = screen.getByRole('textbox')
  const first = screen.getByRole('checkbox', { name: 'Alpha' })
  const last = screen.getByRole('checkbox', { name: 'Beta' })
  input.focus()
  await user.keyboard('{ArrowDown}')
  expect(first).toHaveFocus()
  await user.keyboard('{ArrowDown}{ArrowDown}')
  expect(last).toHaveFocus()
  await user.keyboard('{ArrowUp}')
  expect(first).toHaveFocus()
  await user.keyboard('{ArrowUp}')
  expect(input).toHaveFocus()
  await user.keyboard('{ArrowUp}{Home}')
  expect(first).toHaveFocus()
  await user.keyboard('{End}')
  expect(last).toHaveFocus()
  expect(fireEvent.keyDown(last, { key: 'ArrowDown', cancelable: true })).toBe(false)
})

it('keeps Space native and transfers printable characters and Backspace to controlled search', async () => {
  render(<Demo />)
  const user = userEvent.setup()
  const input = screen.getByRole('textbox')
  input.focus()
  await user.keyboard('{ArrowDown} ')
  expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked()
  await user.keyboard('a')
  expect(input).toHaveFocus()
  expect(input).toHaveValue('a')
  await user.keyboard('{ArrowDown}b')
  expect(input).toHaveValue('ab')
  await user.keyboard('{ArrowDown}{Backspace}')
  expect(input).toHaveValue('a')
  expect(input).toHaveFocus()
})

it('edits the search selection and ignores modifiers and composition', async () => {
  render(<Demo />)
  const user = userEvent.setup()
  const input = screen.getByRole('textbox') as HTMLInputElement
  await user.type(input, 'abc')
  input.setSelectionRange(1, 2)
  await user.keyboard('{ArrowDown}Z')
  expect(input).toHaveValue('aZc')
  await user.keyboard('{ArrowDown}')
  const item = screen.getByRole('checkbox', { name: 'Alpha' })
  for (const modifier of ['ctrlKey', 'metaKey', 'altKey']) {
    fireEvent.keyDown(item, { key: 'x', [modifier]: true })
    expect(item).toHaveFocus()
  }
  fireEvent.keyDown(item, { key: 'x', isComposing: true })
  expect(item).toHaveFocus()
  expect(input).toHaveValue('aZc')
})

it('discovers changed and empty lists at keydown time using a custom selector', async () => {
  const view = render(<Demo names={[]} selector='[role="checkbox"]' />)
  const user = userEvent.setup()
  const input = screen.getByRole('textbox')
  input.focus()
  await user.keyboard('{ArrowDown}{ArrowUp}')
  expect(input).toHaveFocus()
  view.rerender(<Demo names={['New', 'Other']} selector='[role="checkbox"]' />)
  await user.keyboard('{ArrowDown}')
  expect(screen.getByRole('checkbox', { name: 'New' })).toHaveFocus()
  view.rerender(<Demo names={['New', 'Added']} selector='[role="checkbox"]' />)
  await user.keyboard('{ArrowDown}')
  expect(screen.getByRole('checkbox', { name: 'Added' })).toHaveFocus()
})

it('respects composed handlers preventing default', async () => {
  render(<Demo cancel />)
  const input = screen.getByRole('textbox')
  input.focus()
  await userEvent.keyboard('{ArrowDown}')
  expect(input).toHaveFocus()
})

it('skips aria-disabled and hidden items', async () => {
  render(<Demo names={['Alpha', 'Hidden', 'Beta']} />)
  const input = screen.getByRole('textbox')
  const first = screen.getByRole('checkbox', { name: 'Alpha' })
  first.setAttribute('aria-disabled', 'true')
  screen.getByRole('checkbox', { name: 'Hidden' }).parentElement!.hidden = true
  input.focus()
  await userEvent.keyboard('{ArrowDown}')
  expect(screen.getByRole('checkbox', { name: 'Beta' })).toHaveFocus()
})
