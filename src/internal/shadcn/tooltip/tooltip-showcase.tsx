import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { StateGrid } from '@/internal/state-grid'

export function TooltipShowcase() {
  return (
    <TooltipProvider>
      <StateGrid
        states={[
          {
            label: 'default',
            node: (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to library</p>
                </TooltipContent>
              </Tooltip>
            ),
          },
          {
            label: 'side: bottom',
            node: (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Opens below the trigger</p>
                </TooltipContent>
              </Tooltip>
            ),
          },
          {
            label: 'side: right',
            node: (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Opens to the right</p>
                </TooltipContent>
              </Tooltip>
            ),
          },
        ]}
      />
    </TooltipProvider>
  )
}
