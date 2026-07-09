import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { Moon, Sun, Boxes } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { useThemeStore } from '@/store/theme-store'

function RootLayout() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Boxes className="size-5" />
            <span>Component Collection</span>
          </Link>
          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
