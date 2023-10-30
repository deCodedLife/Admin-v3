/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'
import useMenu from '../../../../../app/api/hooks/useMenu'
import { MenuItemType } from '../../../../../app/types/global'

const MenuItem: React.FC<MenuItemType> = (props) => {
  const { children, href, icon, title } = props
  if (children.length) {
    return <SidebarMenuItemWithSub
      to=''
      title={title}
      fontIcon='bi-layers'
      icon={`/media/crm/icons/${icon ?? "gear"}.svg`}
    >
      {children.map(({ title, href }) => {
        return <SidebarMenuItem
          key={href}
          to={`/${href}`}
          title={title}
          fontIcon='bi-layers'
          hasBullet
        />
      })}
    </SidebarMenuItemWithSub>
  } else {
    return <SidebarMenuItem
      to={`/${href}`}
      icon={`/media/crm/icons/${icon ?? "gear"}.svg`}
      title={title}
      fontIcon='bi-layers'
    />
  }
}

const SidebarMenuMain = () => {

  const { isLoading, data: menu, error } = useMenu()

  if (!menu) {
    return null
  }

  return <>
    {menu.map(menu => <MenuItem key={menu.href} {...menu} />)}
  </>
}

export { SidebarMenuMain }
