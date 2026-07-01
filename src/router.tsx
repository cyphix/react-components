import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import { RootLayout } from '@/pages/root-layout'
import { HomePage } from '@/pages/home-page'
import { ComponentPage } from '@/pages/component-page'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const componentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/components/$componentId',
  component: ComponentPage,
})

const routeTree = rootRoute.addChildren([indexRoute, componentRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
