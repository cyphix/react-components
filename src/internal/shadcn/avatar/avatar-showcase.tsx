import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'
import { StateGrid } from '@/internal/state-grid'

export function AvatarShowcase() {
  return (
    <StateGrid
      states={[
        {
          label: 'image',
          node: (
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ),
        },
        {
          label: 'fallback',
          node: (
            <Avatar>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ),
        },
        {
          label: 'size: sm',
          node: (
            <Avatar size="sm">
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ),
        },
        {
          label: 'size: lg',
          node: (
            <Avatar size="lg">
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ),
        },
        {
          label: 'with badge',
          node: (
            <Avatar>
              <AvatarFallback>CN</AvatarFallback>
              <AvatarBadge className="bg-green-500" />
            </Avatar>
          ),
        },
        {
          label: 'group',
          node: (
            <AvatarGroup>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>EF</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+3</AvatarGroupCount>
            </AvatarGroup>
          ),
        },
      ]}
    />
  )
}
