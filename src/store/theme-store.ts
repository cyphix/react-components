import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const THEME_STORAGE_KEY = 'theme'

type Theme = 'light' | 'dark'

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const next: Theme = get().theme === 'light' ? 'dark' : 'light'
        get().setTheme(next)
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)

// Apply the current store value synchronously (default or cached before rehydrate).
applyTheme(useThemeStore.getState().theme)
