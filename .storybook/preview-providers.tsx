import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
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
    const routeTree = rootRoute.addChildren([
      createRoute({ getParentRoute: () => rootRoute, path: '/profile' }),
      createRoute({ getParentRoute: () => rootRoute, path: '/users' }),
    ])
    return createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })
  })

  return (
    <ThemeProvider attribute="class" enableSystem={false} forcedTheme="dark">
      <QueryClientProvider client={queryClient}>
        <RouterContextProvider router={router}>
          {children}
          <Toaster theme="dark" />
        </RouterContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
