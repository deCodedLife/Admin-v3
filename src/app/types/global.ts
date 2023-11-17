import { ApiPageType } from "./api"

//общий тип данных для страницы
export type PageBuilderType = { data?: ApiPageType, isFetching: boolean, showProgressBar?: boolean }

//меню
export type MenuItemType = {
    children?: Array<MenuItemType>,
    href: string,
    icon: string | null,
    title: string
}

//глобальный поиск по приложению
export type GlobalSearchRowType = { title: string, description: string, href: string }
export type GlobalSearchSectionType = { title: string, rows: Array<GlobalSearchRowType> }

//уведомления 
type NotificationType = { id: number, status: string, user_id: number, title: string, description: string, created_at: string, href: string }
export type NotificationItemType = NotificationType & {
    handleNotificationClick: (id: number, title: string, description: string) => void,
    handleReadNotification: (id: number) => void
}
export type NotificationsType = { notifications?: Array<NotificationItemType>, handleReadNotification: (id: number) => void }


//зарплата авторизованного сотрудника
export type SalaryProgressbarType = {type: "progressbar", title: string, values: Array<{title: string, percent: number, reward: string}>}
export type SalaryRangeType = {type: "range", title: string, values: Array<{title: string, current: number, reach: number, reward: string}>}
export type SalaryType =  SalaryProgressbarType | SalaryRangeType
 