import { createFileRoute } from '@tanstack/react-router'

import { SetupTestPage } from '@/internal/setup-test/setup-test-page'

export const Route = createFileRoute('/setup-test/')({
  component: SetupTestPage,
})
