import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { UploadProgressShowcase } from './upload-progress-showcase'

describe('UploadProgressShowcase', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('keeps transfer complete while independent processing updates arrive', () => {
    render(<UploadProgressShowcase />)
    const name = 'Upload progress for photo.png'
    const processing = () => screen.getByRole('progressbar', { name: 'Server processing progress for photo.png' })
    fireEvent.click(screen.getByRole('button', { name: 'Simulate upload' }))

    for (let step = 0; step < 4; step++) {
      act(() => { vi.advanceTimersByTime(250) })
    }
    expect(screen.getByRole('progressbar', { name })).toHaveAttribute('aria-valuenow', '80')
    expect(processing()).toHaveAttribute('aria-valuenow', '0')

    act(() => { vi.advanceTimersByTime(250) })
    expect(screen.getByText('Processing…')).toBeVisible()
    expect(screen.getByRole('progressbar', { name })).toHaveAttribute('aria-valuenow', '100')
    expect(processing()).not.toHaveAttribute('aria-valuenow')

    act(() => { vi.advanceTimersByTime(1500) })
    expect(screen.getByText('Processing…')).toBeVisible()
    expect(processing()).toHaveAttribute('aria-valuenow', '50')

    act(() => { vi.advanceTimersByTime(1500) })
    expect(screen.getByText('Upload complete')).toBeVisible()
    expect(processing()).toHaveAttribute('aria-valuenow', '100')
  })
})
