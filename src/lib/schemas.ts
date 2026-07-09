import { z } from 'zod'

export const componentSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  variants: z.array(z.string()),
})

export const componentListSchema = z.object({
  components: z.array(componentSummarySchema),
})

export const buttonPressResponseSchema = z.object({
  message: z.string(),
})

export type ComponentSummary = z.infer<typeof componentSummarySchema>
export type ComponentList = z.infer<typeof componentListSchema>
export type ButtonPressResponse = z.infer<typeof buttonPressResponseSchema>
