import { queryOptions } from '@tanstack/react-query'

import {
  buttonPressResponseSchema,
  componentListSchema,
  type ButtonPressResponse,
  type ComponentSummary,
} from '@/lib/schemas'

async function fetchComponents(): Promise<ComponentSummary[]> {
  const res = await fetch('/api/components')
  if (!res.ok) {
    throw new Error(`Failed to load components (${res.status})`)
  }
  const json = await res.json()
  // Validate the mock API response with Zod before trusting it.
  const parsed = componentListSchema.parse(json)
  return parsed.components
}

export const componentsQueryOptions = queryOptions({
  queryKey: ['components'],
  queryFn: fetchComponents,
})

export async function postButtonPress(): Promise<ButtonPressResponse> {
  const res = await fetch('/api/setup-test/button-press', { method: 'POST' })
  if (!res.ok) {
    throw new Error(`Button press failed (${res.status})`)
  }
  const json = await res.json()
  return buttonPressResponseSchema.parse(json)
}
