import type { ReactNode } from 'react'

type State = { label: string; node: ReactNode }

export function StateGrid({ states }: { states: State[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {states.map((state) => (
        <div
          key={state.label}
          className="flex flex-col items-start gap-3 rounded-lg border p-4"
        >
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            {state.label}
          </span>
          <div className="flex min-h-9 items-center">{state.node}</div>
        </div>
      ))}
    </div>
  )
}
