import { CalendarIcon, HomeIcon, InboxIcon, SettingsIcon } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const menuItems = [
  { title: 'Home', icon: HomeIcon, active: true },
  { title: 'Inbox', icon: InboxIcon, active: false },
  { title: 'Calendar', icon: CalendarIcon, active: false },
  { title: 'Settings', icon: SettingsIcon, active: false },
]

export function SidebarShowcase() {
  return (
    <div className="relative h-[400px] overflow-hidden rounded-lg border">
      {/* min-h-full overrides the provider's min-h-svh; absolute + h-full
          override the sidebar container's fixed + h-svh so the demo stays
          contained instead of pinning to the viewport. */}
      <SidebarProvider className="min-h-full">
        <Sidebar collapsible="offcanvas" className="absolute h-full">
          <SidebarHeader>
            <span className="px-2 text-sm font-semibold">Acme Inc</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={item.active}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">Dashboard</span>
          </header>
          <div className="flex flex-1 items-center justify-center p-4">
            <span className="text-muted-foreground text-sm">
              Toggle the sidebar with the button above.
            </span>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
