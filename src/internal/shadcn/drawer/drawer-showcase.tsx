import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { StateGrid } from '@/internal/state-grid'

function DemoDrawer({
  direction,
  label,
}: {
  direction: 'top' | 'bottom' | 'left' | 'right'
  label: string
}) {
  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>
            Set your daily activity goal.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 text-sm text-muted-foreground">
          Drawers are great for mobile-friendly interactions.
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export function DrawerShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'bottom (default)',
          node: <DemoDrawer direction="bottom" label="Open drawer" />,
        },
        {
          label: 'right',
          node: <DemoDrawer direction="right" label="Open right" />,
        },
        {
          label: 'left',
          node: <DemoDrawer direction="left" label="Open left" />,
        },
        {
          label: 'top',
          node: <DemoDrawer direction="top" label="Open top" />,
        },
      ]}
    />
  )
}
