import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { StateGrid } from '@/internal/state-grid'

export function PopoverShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <PopoverHeader>
                  <PopoverTitle>Dimensions</PopoverTitle>
                  <PopoverDescription>
                    Set the dimensions for the layer.
                  </PopoverDescription>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ),
        },
        {
          label: 'with form',
          node: (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Edit dimensions</Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="grid gap-4">
                  <PopoverHeader>
                    <PopoverTitle>Dimensions</PopoverTitle>
                    <PopoverDescription>
                      Set the dimensions for the layer.
                    </PopoverDescription>
                  </PopoverHeader>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="popover-width">Width</Label>
                    <Input
                      id="popover-width"
                      defaultValue="100%"
                      className="col-span-2 h-8"
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <Label htmlFor="popover-height">Height</Label>
                    <Input
                      id="popover-height"
                      defaultValue="25px"
                      className="col-span-2 h-8"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ),
        },
        {
          label: 'side: right',
          node: (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open right</Button>
              </PopoverTrigger>
              <PopoverContent side="right" className="w-56">
                <PopoverDescription>
                  Popovers can open on any side of the trigger.
                </PopoverDescription>
              </PopoverContent>
            </Popover>
          ),
        },
      ]}
    />
  )
}
