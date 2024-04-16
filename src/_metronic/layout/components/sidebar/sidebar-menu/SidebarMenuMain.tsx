/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'
import useMenu from '../../../../../app/api/hooks/useMenu'
import { TMenuItem } from '../../../../../app/types/global'

const MenuItem: React.FC<TMenuItem> = (props) => {
  const { children, href, icon, title } = props
  const hasBullet = !Boolean(icon)
  const resolvedIconPath = icon ? `/media/crm/icons/${icon}.svg` : undefined

  
  if (children?.length) {
    return <SidebarMenuItemWithSub
      to=''
      title={title}
      fontIcon='bi-layers'
      icon={resolvedIconPath}
      hasBullet={hasBullet}
    >
      {children.map((props) => {
        return <MenuItem key={props.href} {...props} />
      })}
    </SidebarMenuItemWithSub>
  } else {
    return <SidebarMenuItem
      to={`/${href}`}
      title={title}
      fontIcon='bi-layers'
      icon={resolvedIconPath}
      hasBullet={hasBullet}
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
