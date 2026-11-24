import { z } from 'zod'

export const buttonPressResponseSchema = z.object({
  message: z.string(),
})

export type ButtonPressResponse = z.infer<typeof buttonPressResponseSchema>
