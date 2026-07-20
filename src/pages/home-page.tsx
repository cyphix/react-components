import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { componentsQueryOptions } from '@/lib/api'
import type { ComponentSummary } from '@/lib/schemas'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function ComponentGrid({
  components,
  testId,
}: {
  components: ComponentSummary[]
  testId: string
}) {
  return (
    <div
      data-testid={testId}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {components.map((component) => (
        <Link
          key={component.id}
          to="/components/$componentId"
          params={{ componentId: component.id }}
          className="group"
        >
          <Card className="h-full transition-colors group-hover:border-ring">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{component.name}</CardTitle>
                <Badge variant="secondary">{component.category}</Badge>
              </div>
              <CardDescription>{component.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1">
              {component.variants.map((variant) => (
                <Badge key={variant} variant="outline">
                  {variant}
                </Badge>
              ))}
            </CardContent>
            <CardFooter className="text-primary text-sm font-medium">
              View states
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export function HomePage() {
  const { data, isPending, isError, error } = useQuery(componentsQueryOptions)

  const byName = (a: ComponentSummary, b: ComponentSummary) =>
    a.name.localeCompare(b.name)
  const cyphixComponents =
    data?.filter((c) => c.source === 'cyphix').toSorted(byName) ?? []
  const shadcnComponents =
    data?.filter((c) => c.source === 'shadcn').toSorted(byName) ?? []

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Components</h1>
        <p className="text-muted-foreground text-sm">
          React components for the shadcn CLI. Data is served by an in-browser
          MirageJS mock and validated with Zod.
        </p>
      </div>

      {isPending && (
        <p data-testid="components-loading" className="text-muted-foreground">
          Loading components…
        </p>
      )}

      {isError && (
        <p data-testid="components-error" className="text-destructive">
          {error instanceof Error ? error.message : 'Something went wrong.'}
        </p>
      )}

      {data && (
        <>
          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">
                Cyphix Components
              </h2>
              <p className="text-muted-foreground text-sm">
                Custom components published in this registry. Install with{' '}
                <code className="bg-muted rounded px-1 py-0.5 text-xs">
                  shadcn add cyphix/react-components/&lt;name&gt;
                </code>
                .
              </p>
            </div>
            {cyphixComponents.length > 0 ? (
              <ComponentGrid
                components={cyphixComponents}
                testId="cyphix-components-grid"
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                No custom components yet.
              </p>
            )}
          </section>

          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">
                shadcn Components
              </h2>
              <p className="text-muted-foreground text-sm">
                Vendored shadcn/ui primitives used by the app and custom
                components. Not published by this registry.
              </p>
            </div>
            <ComponentGrid
              components={shadcnComponents}
              testId="shadcn-components-grid"
            />
          </section>
        </>
      )}
    </div>
  )
}
