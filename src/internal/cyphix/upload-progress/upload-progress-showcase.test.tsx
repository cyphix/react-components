import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { UploadProgressShowcase } from './upload-progress-showcase'

describe('UploadProgressShowcase', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows Processing after transfer and before the response', () => {
    render(<UploadProgressShowcase />)
    const name = 'Upload progress for photo.png'
    fireEvent.click(screen.getByRole('button', { name: 'Simulate upload' }))

    for (let step = 0; step < 4; step++) {
      act(() => { vi.advanceTimersByTime(250) })
    }
    expect(screen.getByRole('progressbar', { name })).toHaveAttribute('aria-valuenow', '80')

    act(() => { vi.advanceTimersByTime(250) })
    expect(screen.getByText('Processing…')).toBeVisible()
    expect(screen.getByRole('progressbar', { name })).not.toHaveAttribute('aria-valuenow')

    act(() => { vi.advanceTimersByTime(1999) })
    expect(screen.getByText('Processing…')).toBeVisible()

    act(() => { vi.advanceTimersByTime(1) })
    expect(screen.getByText('Upload complete')).toBeVisible()
    expect(screen.queryByRole('progressbar', { name })).not.toBeInTheDocument()
  })
})
