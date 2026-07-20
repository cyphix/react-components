import type { ReactNode } from 'react'

import { BadgeShowcase } from '@/internal/badge/badge-showcase'
import { ButtonShowcase } from '@/internal/button/button-showcase'
import { CalloutShowcase } from '@/internal/callout/callout-showcase'
import { CardShowcase } from '@/internal/card/card-showcase'

export const showcases: Record<string, () => ReactNode> = {
  callout: CalloutShowcase,
  button: ButtonShowcase,
  badge: BadgeShowcase,
  card: CardShowcase,
}
