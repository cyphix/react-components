import { AuthUsersCardShowcase } from '@/internal/cyphix/auth-users-card/auth-users-card-showcase'
import { AuthPasskeysCardShowcase } from '@/internal/cyphix/auth-passkeys-card/auth-passkeys-card-showcase'
import { AuthProfileCardShowcase } from '@/internal/cyphix/auth-profile-card/auth-profile-card-showcase'
import { AuthLoginFormShowcase } from '@/internal/cyphix/auth-login-form/auth-login-form-showcase'
import { AuthAdminGuardShowcase } from '@/internal/cyphix/auth-admin-guard/auth-admin-guard-showcase'
import { SettingsLayoutShowcase } from '@/internal/cyphix/settings-layout/settings-layout-showcase'
import { SettingsNavShowcase } from '@/internal/cyphix/settings-nav/settings-nav-showcase'
import type { ReactNode } from 'react'
import { UseListKeyboardNavShowcase } from '@/internal/cyphix/use-list-keyboard-nav/use-list-keyboard-nav-showcase'
import { CreatableComboboxShowcase } from '@/internal/cyphix/creatable-combobox/creatable-combobox-showcase'
import { TimeInputShowcase } from '@/internal/cyphix/time-input/time-input-showcase'

import { AttachmentListShowcase } from '@/internal/cyphix/attachment-list/attachment-list-showcase'
import { CalloutShowcase } from '@/internal/cyphix/callout/callout-showcase'
import { ChatPanelShowcase } from '@/internal/cyphix/chat-panel/chat-panel-showcase'
import { CollectionViewShowcase } from '@/internal/cyphix/collection-view/collection-view-showcase'
import { FileDropzoneShowcase } from '@/internal/cyphix/file-dropzone/file-dropzone-showcase'
import { InfoboxShowcase } from '@/internal/cyphix/infobox/infobox-showcase'
import { SidePanelShowcase } from '@/internal/cyphix/side-panel/side-panel-showcase'
import { SortableShowcase } from '@/internal/cyphix/sortable/sortable-showcase'
import { UploadProgressShowcase } from '@/internal/cyphix/upload-progress/upload-progress-showcase'
import { AccordionShowcase } from '@/internal/shadcn/accordion/accordion-showcase'
import { AlertShowcase } from '@/internal/shadcn/alert/alert-showcase'
import { AlertDialogShowcase } from '@/internal/shadcn/alert-dialog/alert-dialog-showcase'
import { AspectRatioShowcase } from '@/internal/shadcn/aspect-ratio/aspect-ratio-showcase'
import { AttachmentShowcase } from '@/internal/shadcn/attachment/attachment-showcase'
import { AvatarShowcase } from '@/internal/shadcn/avatar/avatar-showcase'
import { BadgeShowcase } from '@/internal/shadcn/badge/badge-showcase'
import { BreadcrumbShowcase } from '@/internal/shadcn/breadcrumb/breadcrumb-showcase'
import { BubbleShowcase } from '@/internal/shadcn/bubble/bubble-showcase'
import { ButtonShowcase } from '@/internal/shadcn/button/button-showcase'
import { ButtonGroupShowcase } from '@/internal/shadcn/button-group/button-group-showcase'
import { CalendarShowcase } from '@/internal/shadcn/calendar/calendar-showcase'
import { CardShowcase } from '@/internal/shadcn/card/card-showcase'
import { CarouselShowcase } from '@/internal/shadcn/carousel/carousel-showcase'
import { ChartShowcase } from '@/internal/shadcn/chart/chart-showcase'
import { CheckboxShowcase } from '@/internal/shadcn/checkbox/checkbox-showcase'
import { CollapsibleShowcase } from '@/internal/shadcn/collapsible/collapsible-showcase'
import { ComboboxShowcase } from '@/internal/shadcn/combobox/combobox-showcase'
import { CommandShowcase } from '@/internal/shadcn/command/command-showcase'
import { ContextMenuShowcase } from '@/internal/shadcn/context-menu/context-menu-showcase'
import { DialogShowcase } from '@/internal/shadcn/dialog/dialog-showcase'
import { DirectionShowcase } from '@/internal/shadcn/direction/direction-showcase'
import { DrawerShowcase } from '@/internal/shadcn/drawer/drawer-showcase'
import { DropdownMenuShowcase } from '@/internal/shadcn/dropdown-menu/dropdown-menu-showcase'
import { EmptyShowcase } from '@/internal/shadcn/empty/empty-showcase'
import { FieldShowcase } from '@/internal/shadcn/field/field-showcase'
import { FormShowcase } from '@/internal/shadcn/form/form-showcase'
import { HoverCardShowcase } from '@/internal/shadcn/hover-card/hover-card-showcase'
import { InputShowcase } from '@/internal/shadcn/input/input-showcase'
import { InputGroupShowcase } from '@/internal/shadcn/input-group/input-group-showcase'
import { InputOtpShowcase } from '@/internal/shadcn/input-otp/input-otp-showcase'
import { ItemShowcase } from '@/internal/shadcn/item/item-showcase'
import { KbdShowcase } from '@/internal/shadcn/kbd/kbd-showcase'
import { LabelShowcase } from '@/internal/shadcn/label/label-showcase'
import { MarkerShowcase } from '@/internal/shadcn/marker/marker-showcase'
import { MenubarShowcase } from '@/internal/shadcn/menubar/menubar-showcase'
import { MessageShowcase } from '@/internal/shadcn/message/message-showcase'
import { MessageScrollerShowcase } from '@/internal/shadcn/message-scroller/message-scroller-showcase'
import { NativeSelectShowcase } from '@/internal/shadcn/native-select/native-select-showcase'
import { NavigationMenuShowcase } from '@/internal/shadcn/navigation-menu/navigation-menu-showcase'
import { PaginationShowcase } from '@/internal/shadcn/pagination/pagination-showcase'
import { PopoverShowcase } from '@/internal/shadcn/popover/popover-showcase'
import { ProgressShowcase } from '@/internal/shadcn/progress/progress-showcase'
import { RadioGroupShowcase } from '@/internal/shadcn/radio-group/radio-group-showcase'
import { ResizableShowcase } from '@/internal/shadcn/resizable/resizable-showcase'
import { ScrollAreaShowcase } from '@/internal/shadcn/scroll-area/scroll-area-showcase'
import { SelectShowcase } from '@/internal/shadcn/select/select-showcase'
import { SeparatorShowcase } from '@/internal/shadcn/separator/separator-showcase'
import { SheetShowcase } from '@/internal/shadcn/sheet/sheet-showcase'
import { SidebarShowcase } from '@/internal/shadcn/sidebar/sidebar-showcase'
import { SkeletonShowcase } from '@/internal/shadcn/skeleton/skeleton-showcase'
import { SliderShowcase } from '@/internal/shadcn/slider/slider-showcase'
import { SonnerShowcase } from '@/internal/shadcn/sonner/sonner-showcase'
import { SpinnerShowcase } from '@/internal/shadcn/spinner/spinner-showcase'
import { SwitchShowcase } from '@/internal/shadcn/switch/switch-showcase'
import { TableShowcase } from '@/internal/shadcn/table/table-showcase'
import { TabsShowcase } from '@/internal/shadcn/tabs/tabs-showcase'
import { TextareaShowcase } from '@/internal/shadcn/textarea/textarea-showcase'
import { ToggleShowcase } from '@/internal/shadcn/toggle/toggle-showcase'
import { ToggleGroupShowcase } from '@/internal/shadcn/toggle-group/toggle-group-showcase'
import { TooltipShowcase } from '@/internal/shadcn/tooltip/tooltip-showcase'

export const showcases: Record<string, () => ReactNode> = {
  'attachment-list': AttachmentListShowcase,
  'file-dropzone': FileDropzoneShowcase,
  'upload-progress': UploadProgressShowcase,
  'auth-users-card': AuthUsersCardShowcase,
  'auth-passkeys-card': AuthPasskeysCardShowcase,
  'auth-profile-card': AuthProfileCardShowcase,
  'auth-login-form': AuthLoginFormShowcase,
  'auth-admin-guard': AuthAdminGuardShowcase,
  'settings-layout': SettingsLayoutShowcase,
  'settings-nav': SettingsNavShowcase,
  'use-list-keyboard-nav': UseListKeyboardNavShowcase,
  'creatable-combobox': CreatableComboboxShowcase,
  'time-input': TimeInputShowcase,
  callout: CalloutShowcase,
  infobox: InfoboxShowcase,
  'side-panel': SidePanelShowcase,
  'chat-panel': ChatPanelShowcase,
  'collection-view': CollectionViewShowcase,
  sortable: SortableShowcase,
  accordion: AccordionShowcase,
  alert: AlertShowcase,
  'alert-dialog': AlertDialogShowcase,
  'aspect-ratio': AspectRatioShowcase,
  attachment: AttachmentShowcase,
  avatar: AvatarShowcase,
  badge: BadgeShowcase,
  breadcrumb: BreadcrumbShowcase,
  bubble: BubbleShowcase,
  button: ButtonShowcase,
  'button-group': ButtonGroupShowcase,
  calendar: CalendarShowcase,
  card: CardShowcase,
  carousel: CarouselShowcase,
  chart: ChartShowcase,
  checkbox: CheckboxShowcase,
  collapsible: CollapsibleShowcase,
  combobox: ComboboxShowcase,
  command: CommandShowcase,
  'context-menu': ContextMenuShowcase,
  dialog: DialogShowcase,
  direction: DirectionShowcase,
  drawer: DrawerShowcase,
  'dropdown-menu': DropdownMenuShowcase,
  empty: EmptyShowcase,
  field: FieldShowcase,
  form: FormShowcase,
  'hover-card': HoverCardShowcase,
  input: InputShowcase,
  'input-group': InputGroupShowcase,
  'input-otp': InputOtpShowcase,
  item: ItemShowcase,
  kbd: KbdShowcase,
  label: LabelShowcase,
  marker: MarkerShowcase,
  menubar: MenubarShowcase,
  message: MessageShowcase,
  'message-scroller': MessageScrollerShowcase,
  'native-select': NativeSelectShowcase,
  'navigation-menu': NavigationMenuShowcase,
  pagination: PaginationShowcase,
  popover: PopoverShowcase,
  progress: ProgressShowcase,
  'radio-group': RadioGroupShowcase,
  resizable: ResizableShowcase,
  'scroll-area': ScrollAreaShowcase,
  select: SelectShowcase,
  separator: SeparatorShowcase,
  sheet: SheetShowcase,
  sidebar: SidebarShowcase,
  skeleton: SkeletonShowcase,
  slider: SliderShowcase,
  sonner: SonnerShowcase,
  spinner: SpinnerShowcase,
  switch: SwitchShowcase,
  table: TableShowcase,
  tabs: TabsShowcase,
  textarea: TextareaShowcase,
  toggle: ToggleShowcase,
  'toggle-group': ToggleGroupShowcase,
  tooltip: TooltipShowcase,
}
