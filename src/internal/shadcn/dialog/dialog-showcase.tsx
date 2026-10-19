import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StateGrid } from '@/internal/state-grid'

export function DialogShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'default',
          node: (
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                Open dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share this document</DialogTitle>
                  <DialogDescription>
                    Anyone with the link will be able to view this document.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  <Button>Copy link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ),
        },
        {
          label: 'with form',
          node: (
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                Edit profile
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dialog-name">Name</Label>
                    <Input id="dialog-name" defaultValue="Pedro Duarte" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dialog-username">Username</Label>
                    <Input id="dialog-username" defaultValue="@peduarte" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ),
        },
      ]}
    />
  )
}
