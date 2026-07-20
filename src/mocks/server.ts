import { createServer, Response } from 'miragejs'

import type { ComponentSummary } from '@/lib/schemas'

const seedComponents: ComponentSummary[] = [
  {
    id: 'callout',
    name: 'Callout',
    description:
      'An attention-drawing callout with info, success, warning, and destructive variants.',
    category: 'Feedback',
    source: 'cyphix',
    variants: ['info', 'success', 'warning', 'destructive'],
  },
  {
    id: 'button',
    name: 'Button',
    description: 'Displays a button or a component that looks like a button.',
    category: 'Actions',
    source: 'shadcn',
    variants: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
  },
  {
    id: 'badge',
    name: 'Badge',
    description: 'Displays a badge or a component that looks like a badge.',
    category: 'Data Display',
    source: 'shadcn',
    variants: ['default', 'secondary', 'destructive', 'outline'],
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Displays a card with header, content, and footer.',
    category: 'Layout',
    source: 'shadcn',
    variants: ['default'],
  },
]

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,
    routes() {
      this.namespace = 'api'
      // Small delay so loading states are observable in dev pages.
      this.timing = 400

      this.get('/components', () => {
        return new Response(200, {}, { components: seedComponents })
      })

      this.get('/components/:id', (_schema, request) => {
        const found = seedComponents.find((c) => c.id === request.params.id)
        if (!found) {
          return new Response(404, {}, { error: 'Component not found' })
        }
        return new Response(200, {}, { component: found })
      })

      this.post('/setup-test/button-press', () => {
        return new Response(200, {}, { message: 'Button was pressed' })
      })
    },
  })
}
