import { createServer, Response } from 'miragejs'

import type { ComponentSummary } from '@/lib/schemas'

const seedComponents: ComponentSummary[] = [
  {
    id: 'callout',
    name: 'Callout',
    description:
      'An attention-drawing callout with info, success, warning, and destructive variants.',
    category: 'Feedback',
    source: 'cyphix',
    variants: ['info', 'success', 'warning', 'destructive'],
  },
  {
    id: 'infobox',
    name: 'Infobox',
    description:
      'A fandom-style infobox that renders titled sections, tabbed images, and label/value rows from a JSON data object.',
    category: 'Data Display',
    source: 'cyphix',
    variants: ['default', 'accent', 'contain', 'cover'],
  },
  {
    id: 'button',
    name: 'Button',
    description: 'Displays a button or a component that looks like a button.',
    category: 'Actions',
    source: 'shadcn',
    variants: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
  },
  {
    id: 'badge',
    name: 'Badge',
    description: 'Displays a badge or a component that looks like a badge.',
    category: 'Data Display',
    source: 'shadcn',
    variants: ['default', 'secondary', 'destructive', 'outline'],
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Displays a card with header, content, and footer.',
    category: 'Layout',
    source: 'shadcn',
    variants: ['default'],
  },
  {
    id: 'alert',
    name: 'Alert',
    description:
      'Callout banner for important contextual information with title and description.',
    category: 'Feedback',
    source: 'shadcn',
    variants: ['default', 'destructive'],
  },
  {
    id: 'aspect-ratio',
    name: 'Aspect Ratio',
    description: 'Constrains content to a fixed width-to-height ratio.',
    category: 'Layout',
    source: 'shadcn',
    variants: ['16:9', '4:3', '1:1'],
  },
  {
    id: 'avatar',
    name: 'Avatar',
    description:
      'User image with fallback initials, status badge, and stacked groups.',
    category: 'Data Display',
    source: 'shadcn',
    variants: ['image', 'fallback', 'sm', 'lg', 'badge', 'group'],
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    description:
      'Hierarchical navigation trail with links, separators, and ellipsis.',
    category: 'Navigation',
    source: 'shadcn',
    variants: ['default', 'with-ellipsis', 'custom-separator'],
  },
  {
    id: 'bubble',
    name: 'Bubble',
    description: 'Chat message bubble with color variants and alignment.',
    category: 'Chat',
    source: 'shadcn',
    variants: ['default', 'secondary', 'muted', 'outline', 'ghost', 'destructive'],
  },
  {
    id: 'button-group',
    name: 'Button Group',
    description: 'Groups related buttons into a joined segmented control.',
    category: 'Actions',
    source: 'shadcn',
    variants: ['horizontal', 'vertical'],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    description:
      'Binary selection control with checked, disabled, and invalid states.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'checked', 'disabled', 'invalid', 'with-label'],
  },
  {
    id: 'empty',
    name: 'Empty',
    description:
      'Empty-state placeholder with media, title, description, and actions.',
    category: 'Feedback',
    source: 'shadcn',
    variants: ['default', 'icon'],
  },
  {
    id: 'field',
    name: 'Field',
    description:
      'Form field wrapper combining label, control, description, and error.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['vertical', 'horizontal', 'responsive'],
  },
  {
    id: 'input',
    name: 'Input',
    description:
      'Single-line text input supporting types, disabled, and invalid states.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'with-value', 'disabled', 'invalid', 'password', 'file'],
  },
  {
    id: 'input-group',
    name: 'Input Group',
    description: 'Input with inline or block addons, text, and buttons.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['inline-start', 'inline-end', 'block-start', 'block-end'],
  },
  {
    id: 'input-otp',
    name: 'Input OTP',
    description: 'Segmented one-time-code input with slots and separators.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'with-separator', 'prefilled', 'disabled'],
  },
  {
    id: 'item',
    name: 'Item',
    description: 'Flexible list row with media, content, and actions.',
    category: 'Data Display',
    source: 'shadcn',
    variants: ['default', 'outline', 'muted', 'sm'],
  },
  {
    id: 'kbd',
    name: 'Kbd',
    description: 'Inline keyboard key hint, single or grouped.',
    category: 'Data Display',
    source: 'shadcn',
    variants: ['single-key', 'group', 'combination', 'in-text'],
  },
  {
    id: 'label',
    name: 'Label',
    description: 'Accessible form label pairing with inputs and checkboxes.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'with-input', 'with-checkbox', 'disabled-peer'],
  },
  {
    id: 'marker',
    name: 'Marker',
    description: 'Timeline or list divider label with icon and separator styles.',
    category: 'Chat',
    source: 'shadcn',
    variants: ['default', 'separator', 'border'],
  },
  {
    id: 'message',
    name: 'Message',
    description: 'Chat message row with avatar, header, footer, and alignment.',
    category: 'Chat',
    source: 'shadcn',
    variants: ['default', 'align-end', 'with-avatar', 'header-footer'],
  },
  {
    id: 'native-select',
    name: 'Native Select',
    description: 'Styled native select element with sizes and option groups.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'sm', 'optgroup', 'disabled', 'invalid'],
  },
  {
    id: 'progress',
    name: 'Progress',
    description: 'Horizontal bar indicating completion percentage.',
    category: 'Feedback',
    source: 'shadcn',
    variants: ['empty', '33%', '66%', 'complete'],
  },
  {
    id: 'radio-group',
    name: 'Radio Group',
    description: 'Single-choice option list with labeled radio items.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'disabled', 'disabled-item'],
  },
  {
    id: 'separator',
    name: 'Separator',
    description: 'Thin rule dividing content horizontally or vertically.',
    category: 'Layout',
    source: 'shadcn',
    variants: ['horizontal', 'vertical'],
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    description: 'Animated placeholder blocks shown while content loads.',
    category: 'Feedback',
    source: 'shadcn',
    variants: ['line', 'circle', 'rectangle', 'card'],
  },
  {
    id: 'slider',
    name: 'Slider',
    description: 'Draggable track for selecting a value or range.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'range', 'stepped', 'disabled'],
  },
  {
    id: 'spinner',
    name: 'Spinner',
    description: 'Animated loading indicator in multiple sizes.',
    category: 'Feedback',
    source: 'shadcn',
    variants: ['default', 'lg', 'muted', 'in-button'],
  },
  {
    id: 'switch',
    name: 'Switch',
    description: 'On/off toggle control with sizes and disabled states.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'checked', 'sm', 'disabled', 'with-label'],
  },
  {
    id: 'textarea',
    name: 'Textarea',
    description: 'Multi-line text input with auto field sizing.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'with-value', 'disabled', 'invalid'],
  },
  {
    id: 'toggle',
    name: 'Toggle',
    description: 'Pressable two-state button for toolbar options.',
    category: 'Actions',
    source: 'shadcn',
    variants: ['default', 'outline'],
  },
  {
    id: 'toggle-group',
    name: 'Toggle Group',
    description: 'Set of toggles with single or multiple selection.',
    category: 'Actions',
    source: 'shadcn',
    variants: ['multiple', 'single', 'outline', 'sm', 'disabled'],
  },
  {
    id: 'accordion',
    name: 'Accordion',
    description:
      'A vertically stacked set of interactive headings that each reveal a section of content.',
    category: 'Layout',
    source: 'shadcn',
    variants: ['single', 'collapsible'],
  },
  {
    id: 'alert-dialog',
    name: 'Alert Dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
    category: 'Overlays',
    source: 'shadcn',
    variants: ['default', 'destructive', 'sm'],
  },
  {
    id: 'attachment',
    name: 'Attachment',
    description:
      'File and image attachment cards with upload states, sizes, and scrollable groups.',
    category: 'Chat',
    source: 'shadcn',
    variants: ['default', 'sm', 'xs', 'horizontal', 'vertical'],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description:
      'Date picker built on react-day-picker with single and range selection modes.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['single', 'range'],
  },
  {
    id: 'carousel',
    name: 'Carousel',
    description:
      'Embla-powered slide carousel with previous/next controls and keyboard navigation.',
    category: 'Data Display',
    source: 'shadcn',
    variants: ['default'],
  },
  {
    id: 'chart',
    name: 'Chart',
    description:
      'Recharts wrapper with themed container, tooltip, and legend for building charts.',
    category: 'Data Display',
    source: 'shadcn',
    variants: ['bar'],
  },
  {
    id: 'collapsible',
    name: 'Collapsible',
    description: 'An interactive component which expands and collapses a panel.',
    category: 'Layout',
    source: 'shadcn',
    variants: ['open', 'closed'],
  },
  {
    id: 'combobox',
    name: 'Combobox',
    description:
      'An autocomplete input that lets users search and pick from a filtered list of options.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'with-clear', 'disabled'],
  },
  {
    id: 'command',
    name: 'Command',
    description:
      'A composable command palette with fuzzy search, groups, and keyboard navigation.',
    category: 'Navigation',
    source: 'shadcn',
    variants: ['inline', 'dialog'],
  },
  {
    id: 'context-menu',
    name: 'Context Menu',
    description: 'A menu of actions opened by right-clicking a trigger area.',
    category: 'Overlays',
    source: 'shadcn',
    variants: ['default', 'destructive-item'],
  },
  {
    id: 'dialog',
    name: 'Dialog',
    description:
      'A modal window overlaid on the page for focused tasks and confirmations.',
    category: 'Overlays',
    source: 'shadcn',
    variants: ['default', 'with-form'],
  },
  {
    id: 'direction',
    name: 'Direction',
    description:
      'Provider and hook for LTR/RTL reading-direction context and layout flipping.',
    category: 'Layout',
    source: 'shadcn',
    variants: ['ltr', 'rtl'],
  },
  {
    id: 'drawer',
    name: 'Drawer',
    description:
      'A panel that slides in from an edge of the screen, great for mobile flows.',
    category: 'Overlays',
    source: 'shadcn',
    variants: ['bottom', 'right', 'left', 'top'],
  },
  {
    id: 'dropdown-menu',
    name: 'Dropdown Menu',
    description: 'A menu of actions or options opened from a trigger button.',
    category: 'Overlays',
    source: 'shadcn',
    variants: ['default', 'checkbox-items', 'radio-group', 'with-submenu'],
  },
  {
    id: 'form',
    name: 'Form',
    description:
      'React-hook-form + zod field primitives with labels, descriptions, and validation messages.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default'],
  },
  {
    id: 'hover-card',
    name: 'Hover Card',
    description: 'A floating card that previews content when hovering a trigger.',
    category: 'Overlays',
    source: 'shadcn',
    variants: ['default', 'side-right'],
  },
  {
    id: 'menubar',
    name: 'Menubar',
    description:
      'A desktop-style horizontal menu bar with nested menus and shortcuts.',
    category: 'Navigation',
    source: 'shadcn',
    variants: ['default'],
  },
  {
    id: 'message-scroller',
    name: 'Message Scroller',
    description:
      'Chat viewport that pins to the newest message with a scroll-to-end button.',
    category: 'Chat',
    source: 'shadcn',
    variants: ['default'],
  },
  {
    id: 'navigation-menu',
    name: 'Navigation Menu',
    description:
      'A collection of links and flyout panels for site navigation.',
    category: 'Navigation',
    source: 'shadcn',
    variants: ['default'],
  },
  {
    id: 'pagination',
    name: 'Pagination',
    description:
      'Page navigation with previous/next links, page numbers, and ellipsis.',
    category: 'Navigation',
    source: 'shadcn',
    variants: ['default', 'active', 'ellipsis'],
  },
  {
    id: 'popover',
    name: 'Popover',
    description: 'A floating panel with rich content anchored to a trigger.',
    category: 'Overlays',
    source: 'shadcn',
    variants: ['default', 'with-form', 'side-right'],
  },
  {
    id: 'resizable',
    name: 'Resizable',
    description:
      'Draggable panel groups with horizontal, vertical, and nested layouts.',
    category: 'Layout',
    source: 'shadcn',
    variants: ['horizontal', 'vertical'],
  },
  {
    id: 'scroll-area',
    name: 'Scroll Area',
    description:
      'A scrollable region with custom cross-browser styled scrollbars.',
    category: 'Layout',
    source: 'shadcn',
    variants: ['vertical', 'horizontal'],
  },
  {
    id: 'select',
    name: 'Select',
    description:
      'A dropdown list for picking a single value from a set of options.',
    category: 'Forms',
    source: 'shadcn',
    variants: ['default', 'grouped', 'sm', 'disabled'],
  },
  {
    id: 'sheet',
    name: 'Sheet',
    description: 'A dialog panel that slides in from any side of the screen.',
    category: 'Overlays',
    source: 'shadcn',
    variants: ['right', 'left', 'top', 'bottom'],
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description:
      'Collapsible application sidebar with header, groups, menu items, and inset content.',
    category: 'Navigation',
    source: 'shadcn',
    variants: ['sidebar', 'floating', 'inset'],
  },
  {
    id: 'sonner',
    name: 'Sonner',
    description:
      'Toast notifications with semantic variants, descriptions, and action buttons.',
    category: 'Feedback',
    source: 'shadcn',
    variants: ['default', 'success', 'error', 'warning', 'info', 'action'],
  },
  {
    id: 'table',
    name: 'Table',
    description:
      'A responsive data table with header, body, footer, and caption.',
    category: 'Data Display',
    source: 'shadcn',
    variants: ['default'],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    description: 'A set of layered panels of content displayed one at a time.',
    category: 'Navigation',
    source: 'shadcn',
    variants: ['default', 'line'],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    description:
      'A short informative popup shown when hovering or focusing an element.',
    category: 'Overlays',
    source: 'shadcn',
    variants: ['default', 'side-bottom', 'side-right'],
  },
]

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,
    routes() {
      this.namespace = 'api'
      // Small delay so loading states are observable in dev pages.
      this.timing = 400

      this.get('/components', () => {
        return new Response(200, {}, { components: seedComponents })
      })

      this.get('/components/:id', (_schema, request) => {
        const found = seedComponents.find((c) => c.id === request.params.id)
        if (!found) {
          return new Response(404, {}, { error: 'Component not found' })
        }
        return new Response(200, {}, { component: found })
      })

      this.post('/setup-test/button-press', () => {
        return new Response(200, {}, { message: 'Button was pressed' })
      })
    },
  })
}
