import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

export function NavigationMenuShowcase() {
  return (
    <div className="min-h-64">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-72 gap-1 p-1">
                <li>
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Introduction</div>
                    <div className="text-muted-foreground">
                      Re-usable components built with Tailwind CSS.
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Installation</div>
                    <div className="text-muted-foreground">
                      How to install dependencies and structure your app.
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Typography</div>
                    <div className="text-muted-foreground">
                      Styles for headings, paragraphs, lists...
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-72 gap-1 p-1">
                <li>
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Button</div>
                    <div className="text-muted-foreground">
                      Displays a button or a component that looks like one.
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Dialog</div>
                    <div className="text-muted-foreground">
                      A window overlaid on the primary content.
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
