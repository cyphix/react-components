import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { componentsQueryOptions } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function HomePage() {
  const { data, isPending, isError, error } = useQuery(componentsQueryOptions)

  return (
    <div className="space-y-6">
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
        <div
          data-testid="components-grid"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data.map((component) => (
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
      )}
    </div>
  )
}
