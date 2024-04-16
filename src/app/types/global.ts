import { TApiPage } from "./api"

//общий тип данных для страницы
export type TPageBuilder = { data?: TApiPage, isFetching: boolean, showProgressBar?: boolean }

//меню
export type TMenuItem = {
    children?: Array<TMenuItem>,
    href: string,
    icon: string | null,
    title: string
}

//глобальный поиск по приложению
export type TGlobalSearchRow = { title: string, description: string, href: string }
export type TGlobalSearchSection = { title: string, rows: Array<TGlobalSearchRow> }

//уведомления 
type TNotification = { id: number, status: string, user_id: number, title: string, description: string, created_at: string, href: string }
export type TNotificationItem = TNotification & {
    handleNotificationClick: (id: number, title: string, description: string) => void,
    handleReadNotification: (id: number) => void
}
export type TNotifications = { notifications?: Array<TNotificationItem>, handleReadNotification: (id: number) => void }