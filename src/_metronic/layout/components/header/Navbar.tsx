import clsx from 'clsx'
import { useAuth } from '../../../../app/modules/auth'
import { KTSVG, toAbsoluteUrl } from '../../../helpers'
import { HeaderNotificationsMenu, HeaderUserMenu, Search, ThemeModeSwitcher } from '../../../partials'
import { useLayout } from '../../core'
import { useSetupContext } from '../../../../app/constructor/helpers/SetupContext'
import { useCallback, useEffect, useMemo } from 'react'
import { getApiUrl } from '../../../../app/api'
import useMutate from '../../../../app/api/hooks/useMutate'
import ModuleDomRu from '../../../../app/constructor/modules/ModuleDomRu'
import usePrevious from '../../../../app/constructor/helpers/usePrevious'
import useNotifications from '../../../../app/api/hooks/useNotifications'
import ModuleDialog from '../../../../app/constructor/modules/ModuleDialog'
import ModuleDeveloper from '../../../../app/constructor/modules/ModuleDeveloper'
import ModuleSalaryWidgets from '../../../../app/constructor/modules/ModuleSalaryWidgets'


const itemClass = 'ms-1 ms-lg-3'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px'
const userAvatarClass = 'symbol-35px symbol-md-40px'
const btnIconClass = 'svg-icon-1'

const ComponentNotifications: React.FC = () => {


  /*
  --- Запрос на получение уведомлений, информация по прошлым уведомлениям, запрос на удаление уведомлений 
  */
  const { data: notifications, refetch } = useNotifications()

  const previousNotificationsIds = usePrevious(Array.isArray(notifications) ? notifications.map(notification => notification.id) : null)
  const { mutate, isSuccess } = useMutate("notifications", "remove", { success: false, error: false })
  useEffect(() => {
    if (isSuccess) {
      refetch()
    }
  }, [isSuccess])

  /*
  --- Временно отключил автообновление по причине неисправности. Добавлена цикличность запросов в useNotifications
   */
  /*  useUpdate([{ active: true, update: refetch }], "notifications") */


  /*
  --- Сравнение массива id уведомлений из прошлого запроса и текущего. Если в текущем массиве есть хотя бы 1 id, которого не было в прошлом - проигрывать звук. 
  */
  useEffect(() => {
    if (Array.isArray(notifications) && Array.isArray(previousNotificationsIds)) {
      const notificationsAsIds = notifications.map(notification => notification.id)
      if (notificationsAsIds.some(id => !previousNotificationsIds.includes(id))) {
        const audio = new Audio(toAbsoluteUrl("/media/crm/sounds/alert.mp3"))
        audio.play()
      }
    }
  }, [notifications])


  const notificationsCount = notifications?.length || 0


  const handleReadNotification = useCallback((id: number) => mutate({ id }), [])


  return <div className={clsx('app-navbar-item pulse pulse-primary notifications', itemClass)}>
    <div
      data-kt-menu-trigger="{default: 'click'}"
      data-kt-menu-attach='parent'
      data-kt-menu-placement='bottom-end'
      className={btnClass}
    >
      <KTSVG path='/media/crm/icons/notification.svg' className={`${btnIconClass} notifications_icon`} />

      {notificationsCount ? <>
        <span className="pulse-ring" />
        <span className="notifications_count">{notificationsCount}</span>
      </> : null}
    </div>
    <HeaderNotificationsMenu notifications={notifications} handleReadNotification={handleReadNotification} />
  </div>
}

const Navbar = () => {
  const { config } = useLayout()
  const { context } = useSetupContext()
  const chat = context.dialog_widget
  const enableGlobalSearch = Boolean(context.global_search)
  const enableDomRuModule = Boolean(context.dom_ru)
  const { currentUser } = useAuth()
  const showDevMenu = Number(currentUser?.role_id) === 1
  const showSalaryWidget = Boolean(context.salary_widget)

  const userAvatar = useMemo(() => {
    if (currentUser?.avatar) {
      return currentUser.avatar.includes("https") ? currentUser.avatar : `${getApiUrl()}${currentUser.avatar}`
    } else {
      return toAbsoluteUrl('/media/crm/assets/blank.png')
    }
  }, [currentUser])

  return (
    <div className='app-navbar flex-shrink-0'>
      {showSalaryWidget ? <ModuleSalaryWidgets /> : null}

      {enableDomRuModule ? <ModuleDomRu /> : null}
      {
        enableGlobalSearch ? <div className={clsx('app-navbar-item', itemClass)}>
          <Search />
        </div> : null
      }

      {/* <div className={clsx('app-navbar-item', itemClass)}>
        <div id='kt_activities_toggle' className={btnClass}>
          <KTSVG path='/media/icons/duotune/general/gen032.svg' className={btnIconClass} />
        </div>
      </div> */}

      <ComponentNotifications />

      {/* чат отключен до рефакторинга */}
      {chat ? <ModuleDialog {...chat} /> : null}

      <div className={clsx('app-navbar-item', itemClass)}>
        <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
      </div>

      {
        showDevMenu ? <div className={clsx('app-navbar-item', itemClass)}>
          <ModuleDeveloper toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
        </div> : null
      }

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img src={userAvatar} style={{ objectFit: "cover" }} alt="header_user_avatar" />
        </div>
        <HeaderUserMenu />
      </div>
    </div>
  )
}

export { Navbar }
