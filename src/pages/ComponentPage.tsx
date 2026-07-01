import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { componentsQueryOptions } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { showcases } from '@/pages/showcases'

export function ComponentPage() {
  const { componentId } = useParams({ from: '/components/$componentId' })
  const { data } = useQuery(componentsQueryOptions)

  const meta = data?.find((c) => c.id === componentId)
  const Showcase = showcases[componentId]

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {meta?.name ?? componentId}
          </h1>
          {meta && <Badge variant="secondary">{meta.category}</Badge>}
        </div>
        {meta && (
          <p className="text-muted-foreground text-sm">{meta.description}</p>
        )}
      </div>

      {Showcase ? (
        <section data-testid="component-states" className="space-y-3">
          <h2 className="text-sm font-semibold">States</h2>
          <Showcase />
        </section>
      ) : (
        <p className="text-destructive" data-testid="component-missing">
          No dev page registered for “{componentId}”.
        </p>
      )}
    </div>
  )
}
