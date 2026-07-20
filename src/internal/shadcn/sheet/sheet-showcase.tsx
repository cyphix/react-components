import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { StateGrid } from '@/internal/state-grid'

function DemoSheet({
  side,
  label,
}: {
  side: 'top' | 'right' | 'bottom' | 'left'
  label: string
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{label}</Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function SheetShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'right (default)',
          node: <DemoSheet side="right" label="Open sheet" />,
        },
        { label: 'left', node: <DemoSheet side="left" label="Open left" /> },
        { label: 'top', node: <DemoSheet side="top" label="Open top" /> },
        {
          label: 'bottom',
          node: <DemoSheet side="bottom" label="Open bottom" />,
        },
      ]}
    />
  )
}
