import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { postButtonPress } from '@/lib/api'

export function SetupTestPage() {
  const { mutate, isPending } = useMutation({
    mutationFn: postButtonPress,
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong.',
      )
    },
  })

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Setup Test</h1>
        <p className="text-muted-foreground text-sm">
          Press the button to send a request via TanStack Query. MirageJS mocks
          the backend and Sonner shows the response.
        </p>
      </div>
      <Button disabled={isPending} onClick={() => mutate()}>
        {isPending && <Loader2 className="animate-spin" />}
        Press me
      </Button>
    </div>
  )
}
