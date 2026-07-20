import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { StateGrid } from '@/internal/state-grid'

export function AlertShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <div className="w-64">
              <Alert>
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app.
                </AlertDescription>
              </Alert>
            </div>
          ),
        },
        {
          label: 'with icon',
          node: (
            <div className="w-64">
              <Alert>
                <Info />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app.
                </AlertDescription>
              </Alert>
            </div>
          ),
        },
        {
          label: 'destructive',
          node: (
            <div className="w-64">
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </Alert>
            </div>
          ),
        },
        {
          label: 'title only',
          node: (
            <div className="w-64">
              <Alert>
                <CheckCircle2 />
                <AlertTitle>Changes saved successfully</AlertTitle>
              </Alert>
            </div>
          ),
        },
      ]}
    />
  )
}
