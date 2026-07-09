import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Server } from 'miragejs'
import { toast } from 'sonner'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { SetupTestPage } from '@/internal/setup-test/setup-test-page'
import { makeServer } from '@/mocks/server'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  )
}

describe('SetupTestPage', () => {
  let server: Server

  beforeAll(() => {
    server = makeServer({ environment: 'test' })
  })

  afterAll(() => {
    server.shutdown()
  })

  it('sends a button press request and shows a success toast', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<SetupTestPage />)

    await user.click(screen.getByRole('button', { name: /press me/i }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Button was pressed')
    })
  })
})
