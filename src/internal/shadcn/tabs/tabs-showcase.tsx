import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TabsShowcase() {
  return (
    <div className="flex max-w-md flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          default
        </span>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="text-sm text-muted-foreground">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password" className="text-sm text-muted-foreground">
            Change your password here.
          </TabsContent>
          <TabsContent value="settings" className="text-sm text-muted-foreground">
            Manage your preferences here.
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          line
        </span>
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-sm text-muted-foreground">
            A quick overview of your project.
          </TabsContent>
          <TabsContent value="analytics" className="text-sm text-muted-foreground">
            Traffic and usage analytics.
          </TabsContent>
          <TabsContent value="reports" className="text-sm text-muted-foreground">
            Generated reports and exports.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
