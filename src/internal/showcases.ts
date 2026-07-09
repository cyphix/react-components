import type { ReactNode } from 'react'

import { BadgeShowcase } from '@/internal/badge/badge-showcase'
import { ButtonShowcase } from '@/internal/button/button-showcase'
import { CardShowcase } from '@/internal/card/card-showcase'

export const showcases: Record<string, () => ReactNode> = {
  button: ButtonShowcase,
  badge: BadgeShowcase,
  card: CardShowcase,
}
