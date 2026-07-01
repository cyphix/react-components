import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type State = { label: string; node: ReactNode }

function StateGrid({ states }: { states: State[] }) {
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

function ButtonShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <Button>Button</Button> },
        {
          label: 'secondary',
          node: <Button variant="secondary">Button</Button>,
        },
        {
          label: 'destructive',
          node: <Button variant="destructive">Button</Button>,
        },
        { label: 'outline', node: <Button variant="outline">Button</Button> },
        { label: 'ghost', node: <Button variant="ghost">Button</Button> },
        { label: 'link', node: <Button variant="link">Button</Button> },
        { label: 'disabled', node: <Button disabled>Button</Button> },
        {
          label: 'loading',
          node: (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Loading
            </Button>
          ),
        },
        { label: 'size: sm', node: <Button size="sm">Button</Button> },
        { label: 'size: lg', node: <Button size="lg">Button</Button> },
      ]}
    />
  )
}

function BadgeShowcase() {
  return (
    <StateGrid
      states={[
        { label: 'default', node: <Badge>Badge</Badge> },
        { label: 'secondary', node: <Badge variant="secondary">Badge</Badge> },
        {
          label: 'destructive',
          node: <Badge variant="destructive">Badge</Badge>,
        },
        { label: 'outline', node: <Badge variant="outline">Badge</Badge> },
      ]}
    />
  )
}

function CardShowcase() {
  return (
    <div className="max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description goes here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Cards group related content and actions into a single surface.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export const showcases: Record<string, () => ReactNode> = {
  button: ButtonShowcase,
  badge: BadgeShowcase,
  card: CardShowcase,
}
