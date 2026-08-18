import { memo, useCallback } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/shadcn/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/shared/ui/shadcn/sidebar'
import type { NavGroup, NavMainItem, NavSubItem } from '@/shared/constants/sidebar.constants'

interface NavMainProps {
  readonly items: readonly NavGroup[]
}

type IsActiveFn = (url: string, subItems?: NavSubItem[]) => boolean
type IsSubmenuOpenFn = (subItems?: NavSubItem[]) => boolean

function collectAllUrls(items: NavSubItem[]): string[] {
  const urls: string[] = []
  for (const item of items) {
    if (item.url && item.url !== '#') {
      urls.push(item.url)
    }
    if (item.subItems?.length) {
      urls.push(...collectAllUrls(item.subItems))
    }
  }
  return urls
}

function ComingSoonBadge() {
  return (
    <span className="bg-primary text-primary-foreground ml-auto rounded-xs px-1 py-0.5 text-3xs font-medium uppercase tracking-wide">
      Sắp có
    </span>
  )
}

function DropdownSubItems({ items, isActive }: { items: NavSubItem[]; isActive: IsActiveFn }) {
  return (
    <>
      {items.map((subItem) =>
        subItem.subItems?.length ? (
          <DropdownMenuSub key={subItem.title}>
            <DropdownMenuSubTrigger
              disabled={subItem.comingSoon}
              className={cn(
                isActive(subItem.url, subItem.subItems) &&
                  'bg-primary/10 text-primary font-bold',
              )}
            >
              {subItem.icon && <subItem.icon />}
              <span>{subItem.title}</span>
              {subItem.comingSoon && <ComingSoonBadge />}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownSubItems items={subItem.subItems} isActive={isActive} />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : (
          <DropdownMenuItem key={subItem.title} asChild>
            <Link
              to={subItem.url as never}
              target={subItem.newTab ? '_blank' : undefined}
              className={cn(
                'flex cursor-pointer items-center gap-2',
                isActive(subItem.url) && 'bg-primary/10 text-primary font-bold',
              )}
              activeProps={{
                'data-active': true,
                className: 'bg-primary/10 text-primary font-bold',
              }}
            >
              {subItem.icon && <subItem.icon />}
              <span>{subItem.title}</span>
              {subItem.comingSoon && <ComingSoonBadge />}
            </Link>
          </DropdownMenuItem>
        ),
      )}
    </>
  )
}

const NavSubItemsRenderer = memo(function NavSubItemsRenderer({
  items,
  isActive,
  isSubmenuOpen,
  depth = 1,
}: {
  items: NavSubItem[]
  isActive: IsActiveFn
  isSubmenuOpen: IsSubmenuOpenFn
  depth?: number
}) {
  return (
    <SidebarMenuSub>
      {items.map((subItem) => (
        <SidebarMenuSubItem key={subItem.title}>
          {subItem.subItems?.length ? (
            <Collapsible
              defaultOpen={isSubmenuOpen(subItem.subItems)}
              className="group/collapsible"
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuSubButton
                  aria-disabled={subItem.comingSoon}
                  isActive={isActive(subItem.url, subItem.subItems)}
                  className={cn(
                    'relative pr-8',
                    isActive(subItem.url, subItem.subItems) && 'sidebar-menu-sub-button-active',
                  )}
                >
                  {subItem.icon && <subItem.icon />}
                  <span className="truncate">{subItem.title}</span>
                  {subItem.comingSoon && <ComingSoonBadge />}
                  <ChevronRight className="absolute right-2 top-1/2 size-4 shrink-0 -translate-y-1/2 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuSubButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <NavSubItemsRenderer
                  items={subItem.subItems}
                  isActive={isActive}
                  isSubmenuOpen={isSubmenuOpen}
                  depth={depth + 1}
                />
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuSubButton
              aria-disabled={subItem.comingSoon}
              isActive={isActive(subItem.url)}
              className={cn(isActive(subItem.url) && 'sidebar-menu-sub-button-active')}
              asChild
            >
              <Link
                to={subItem.url as never}
                target={subItem.newTab ? '_blank' : undefined}
                className={cn(
                  'relative flex w-full items-center gap-2.5 overflow-hidden rounded-lg',
                  isActive(subItem.url) && 'sidebar-menu-sub-button-active',
                )}
                activeProps={{
                  'data-active': true,
                  className: 'sidebar-menu-sub-button-active',
                }}
              >
                {subItem.icon ? (
                  <subItem.icon className="size-4 shrink-0" />
                ) : (
                  <span className="size-1.5 shrink-0 rounded-full bg-current opacity-60" />
                )}
                <span className="truncate">{subItem.title}</span>
                {subItem.comingSoon && <ComingSoonBadge />}
              </Link>
            </SidebarMenuSubButton>
          )}
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  )
})

const NavItemExpanded = memo(function NavItemExpanded({
  item,
  isActive,
  isSubmenuOpen,
}: {
  item: NavMainItem
  isActive: IsActiveFn
  isSubmenuOpen: IsSubmenuOpenFn
}) {
  // Menu đơn không có submenu
  if (!item.subItems?.length) {
    const isCurrentActive = isActive(item.url)
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          aria-disabled={item.comingSoon}
          isActive={isCurrentActive}
        >
          <Link
            to={item.url as never}
            target={item.newTab ? '_blank' : undefined}
            className="relative flex w-full items-center gap-3 overflow-hidden rounded-xl"
            activeProps={{
              'data-active': true,
              className: 'sidebar-menu-button-active',
            }}
          >
            {item.icon && <item.icon />}
            <span className="truncate">{item.title}</span>
            {item.comingSoon && <ComingSoonBadge />}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  // Menu cha có submenu xổ xuống
  const isParentActive = isActive(item.url, item.subItems)

  return (
    <Collapsible asChild defaultOpen={isSubmenuOpen(item.subItems)} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            disabled={item.comingSoon}
            isActive={isParentActive}
            className={cn(
              'relative overflow-hidden rounded-xl pr-8',
              isParentActive && 'sidebar-menu-button-active',
            )}
          >
            {item.icon && <item.icon />}
            <span className="truncate">{item.title}</span>
            {item.comingSoon && <ComingSoonBadge />}
            <ChevronRight className="absolute right-2 top-1/2 size-4 shrink-0 -translate-y-1/2 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <NavSubItemsRenderer
            items={item.subItems}
            isActive={isActive}
            isSubmenuOpen={isSubmenuOpen}
          />
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
})

const NavItemCollapsed = memo(function NavItemCollapsed({
  item,
  isActive,
}: {
  item: NavMainItem
  isActive: IsActiveFn
}) {
  if (!item.subItems?.length) {
    const isCurrentActive = isActive(item.url)
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          aria-disabled={item.comingSoon}
          tooltip={item.title}
          isActive={isCurrentActive}
        >
          <Link
            to={item.url as never}
            target={item.newTab ? '_blank' : undefined}
            className="relative flex !size-10 items-center justify-center p-0 overflow-hidden rounded-xl before:!hidden"
            activeProps={{
              'data-active': true,
              className:
                'bg-primary/10 dark:bg-primary/20 text-primary font-bold shadow-xs [&_svg]:text-primary before:!hidden',
            }}
          >
            {item.icon && <item.icon />}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  const isParentActive = isActive(item.url, item.subItems)

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            disabled={item.comingSoon}
            tooltip={item.title}
            isActive={isParentActive}
            className={cn(
              'relative flex !size-10 items-center justify-center p-0 overflow-hidden rounded-xl before:!hidden',
              isParentActive &&
                'bg-primary/10 dark:bg-primary/20 text-primary font-bold shadow-xs [&_svg]:text-primary',
            )}
          >
            {item.icon && <item.icon />}
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 w-52"
          side="right"
          align="start"
        >
          <DropdownSubItems items={item.subItems} isActive={isActive} />
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
})

export const NavMain = memo(function NavMain({ items }: NavMainProps) {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const { state } = useSidebar()

  const isItemActive = useCallback<IsActiveFn>(
    (url, subItems) => {
      if (subItems?.length) {
        const urls = collectAllUrls(subItems)
        const hasActiveChild = urls.some(
          (u) => path === u || (u !== '/' && (path.startsWith(`${u}/`) || path.startsWith(`${u}?`))),
        )
        if (hasActiveChild) return true
      }
      if (!url || url === '#') return false
      if (url === '/') return path === '/'
      return path === url || path.startsWith(`${url}/`) || path.startsWith(`${url}?`)
    },
    [path],
  )

  const isSubmenuOpen = useCallback<IsSubmenuOpenFn>(
    (subItems) =>
      subItems
        ? collectAllUrls(subItems).some(
            (u) => path === u || (u !== '/' && (path.startsWith(`${u}/`) || path.startsWith(`${u}?`))),
          )
        : false,
    [path],
  )

  const isCollapsed = state === 'collapsed'

  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.id}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) =>
                isCollapsed ? (
                  <NavItemCollapsed key={item.title} item={item} isActive={isItemActive} />
                ) : (
                  <NavItemExpanded
                    key={item.title}
                    item={item}
                    isActive={isItemActive}
                    isSubmenuOpen={isSubmenuOpen}
                  />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
})

NavMain.displayName = 'NavMain'
