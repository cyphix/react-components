import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterContextProvider,
} from '@tanstack/react-router'
import { ThemeProvider } from 'next-themes'
import { useState, type ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      }),
  )
  const [router] = useState(() => {
    const rootRoute = createRootRoute()
    return createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })
  })

  return (
    <ThemeProvider attribute="class" enableSystem={false} forcedTheme="dark">
      <QueryClientProvider client={queryClient}>
        <RouterContextProvider router={router}>
          {children}
          <Toaster />
        </RouterContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
