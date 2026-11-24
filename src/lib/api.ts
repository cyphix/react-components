import {
  buttonPressResponseSchema,
  type ButtonPressResponse,
} from '@/lib/schemas'

export async function postButtonPress(): Promise<ButtonPressResponse> {
  const res = await fetch('/api/setup-test/button-press', { method: 'POST' })
  if (!res.ok) {
    throw new Error(`Button press failed (${res.status})`)
  }
  const json = await res.json()
  return buttonPressResponseSchema.parse(json)
}
