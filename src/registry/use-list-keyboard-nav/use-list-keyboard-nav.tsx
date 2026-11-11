import { useRef, type KeyboardEvent } from 'react'

/**
 * Spread inputProps on a search input and listProps on its item container.
 * Items must be focusable; the default selector is [data-list-nav-item].
 * Input Up enters at the last item. Navigation never wraps. Space stays native
 * on items; other printable keys and Backspace resume editing the search.
 * Compose handlers by calling yours first; preventDefault opts out of ours.
 */
export function useListKeyboardNav({ itemSelector = '[data-list-nav-item]' } = {}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const items = () => Array.from(
    listRef.current?.querySelectorAll<HTMLElement>(itemSelector) ?? [],
  ).filter(item => !item.matches(':disabled, [aria-disabled="true"], [data-disabled]')
    && !item.closest('[hidden], [inert], [aria-hidden="true"], [aria-disabled="true"], fieldset:disabled')
    && (item.checkVisibility?.() ?? true))

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.defaultPrevented || event.nativeEvent.isComposing) return
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const available = items()
    ;(event.key === 'ArrowDown' ? available[0] : available.at(-1))?.focus()
  }

  function onListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.nativeEvent.isComposing) return
    const available = items()
    const index = available.indexOf(event.target as HTMLElement)
    if (index < 0) return
    let target: HTMLElement | undefined | null
    switch (event.key) {
      case 'ArrowDown': target = available[Math.min(index + 1, available.length - 1)]; break
      case 'ArrowUp': target = index === 0 ? inputRef.current : available[index - 1]; break
      case 'Home': target = available[0]; break
      case 'End': target = available.at(-1); break
      default: {
        if (event.ctrlKey || event.metaKey || event.altKey || event.key === ' ') return
        if (event.key !== 'Backspace' && Array.from(event.key).length !== 1) return
        const input = inputRef.current
        if (!input || input.disabled || input.readOnly) return
        event.preventDefault()
        input.focus()
        const start = input.selectionStart ?? input.value.length
        const end = input.selectionEnd ?? start
        const from = event.key === 'Backspace' && start === end ? Math.max(0, start - 1) : start
        const text = event.key === 'Backspace' ? '' : event.key
        const value = input.value.slice(0, from) + text + input.value.slice(end)
        // Use the native setter so React's controlled-input tracking sees the edit.
        const setter = Object.getOwnPropertyDescriptor(input.ownerDocument.defaultView!.HTMLInputElement.prototype, 'value')!.set!
        setter.call(input, value)
        input.setSelectionRange(from + text.length, from + text.length)
        input.dispatchEvent(new Event('input', { bubbles: true }))
        return
      }
    }
    event.preventDefault()
    target?.focus()
  }

  return {
    inputProps: { ref: inputRef, onKeyDown: onInputKeyDown },
    listProps: { ref: listRef, onKeyDown: onListKeyDown },
  }
}
