import { createFileRoute } from '@tanstack/react-router'

import { ComponentPage } from '@/pages/component-page'

export const Route = createFileRoute('/components/$componentId')({
  component: ComponentPage,
})
