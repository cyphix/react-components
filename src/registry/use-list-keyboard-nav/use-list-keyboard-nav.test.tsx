import { useState } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import { Checkbox } from '@/components/ui/checkbox'
import { useListKeyboardNav } from './use-list-keyboard-nav'

afterEach(cleanup)

it.each(['😀', '👨‍👩‍👧‍👦'])('deletes the whole grapheme %s before the caret', async emoji => {
  render(<Demo />)
  const input = screen.getByRole('textbox') as HTMLInputElement
  fireEvent.change(input, { target: { value: `a${emoji}b` } })
  input.focus()
  input.setSelectionRange(1 + emoji.length, 1 + emoji.length)
  await userEvent.keyboard('{ArrowDown}{Backspace}')
  expect(input).toHaveFocus()
  expect(input).toHaveValue('ab')
  expect(input.selectionStart).toBe(1)
})

it('falls back to deleting a whole code point without Intl.Segmenter', async () => {
  render(<Demo />)
  const input = screen.getByRole('textbox') as HTMLInputElement
  fireEvent.change(input, { target: { value: 'a😀' } })
  input.focus()
  input.setSelectionRange(3, 3)
  const descriptor = Object.getOwnPropertyDescriptor(Intl, 'Segmenter')!
  Object.defineProperty(Intl, 'Segmenter', { ...descriptor, value: undefined })
  try {
    await userEvent.keyboard('{ArrowDown}{Backspace}')
    expect(input).toHaveValue('a')
  } finally {
    Object.defineProperty(Intl, 'Segmenter', descriptor)
  }
})

it('honors maxLength on transfer while allowing replacement, deletion, and unlimited inputs', async () => {
  render(<Demo />)
  const input = screen.getByRole('textbox') as HTMLInputElement
  input.maxLength = 2
  await userEvent.type(input, 'ab')
  await userEvent.keyboard('{ArrowDown}c')
  expect(input).toHaveFocus()
  expect(input).toHaveValue('ab')
  input.setSelectionRange(0, 1)
  await userEvent.keyboard('{ArrowDown}Z')
  expect(input).toHaveValue('Zb')
  input.setSelectionRange(2, 2)
  await userEvent.keyboard('{ArrowDown}{Backspace}')
  expect(input).toHaveValue('Z')
  input.maxLength = 0
  await userEvent.clear(input)
  await userEvent.keyboard('{ArrowDown}a')
  expect(input).toHaveFocus()
  expect(input).toHaveValue('')
  input.removeAttribute('maxlength')
  await userEvent.keyboard('{ArrowDown}a')
  expect(input).toHaveValue('a')
})

it('skips aria-disabled descendants and disabled fieldset controls but allows links', async () => {
  render(<Demo names={['Aria disabled', 'Fieldset disabled', 'Enabled']} />)
  const ariaItem = screen.getByRole('checkbox', { name: 'Aria disabled' })
  ariaItem.parentElement!.setAttribute('aria-disabled', 'true')
  const placeholder = screen.getByRole('checkbox', { name: 'Fieldset disabled' })
  const fieldsetItem = document.createElement('button')
  fieldsetItem.textContent = 'Fieldset disabled'
  fieldsetItem.setAttribute('data-list-nav-item', '')
  placeholder.replaceWith(fieldsetItem)
  const fieldset = document.createElement('fieldset')
  fieldset.disabled = true
  fieldsetItem.parentElement!.append(fieldset)
  fieldset.append(fieldsetItem)
  const link = document.createElement('a')
  link.href = '#example'
  link.textContent = 'Focusable link'
  link.setAttribute('data-list-nav-item', '')
  fieldset.append(link)
  const input = screen.getByRole('textbox')
  input.focus()
  await userEvent.keyboard('{ArrowDown}')
  expect(fieldsetItem).toBeDisabled()
  expect(link).toHaveFocus()
  fireEvent.keyDown(link, { key: 'ArrowDown' })
  expect(screen.getByRole('checkbox', { name: 'Enabled' })).toHaveFocus()
  await userEvent.keyboard('{ArrowUp}')
  expect(link).toHaveFocus()
  fireEvent.keyDown(link, { key: 'ArrowUp' })
  expect(input).toHaveFocus()
})

it('skips CSS-hidden items when entering and moving through the list', async () => {
  render(<Demo names={['Hidden', 'Alpha', 'Also hidden', 'Beta']} />)
  for (const name of ['Hidden', 'Also hidden']) {
    const item = screen.getByRole('checkbox', { name })
    item.style.display = 'none'
    Object.defineProperty(item, 'checkVisibility', { value: () => false })
  }
  const input = screen.getByRole('textbox')
  input.focus()
  await userEvent.keyboard('{ArrowDown}')
  expect(screen.getByRole('checkbox', { name: 'Alpha' })).toHaveFocus()
  await userEvent.keyboard('{ArrowDown}')
  expect(screen.getByRole('checkbox', { name: 'Beta' })).toHaveFocus()
})

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
