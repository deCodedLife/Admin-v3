import { MenuItemType } from "./global"
import {
    ModuleAccordionType,
    ModuleAppEditorType,
    ModuleCalendarType,
    ModuleChatType, ModuleDayPlanningType, ModuleDocumentsType, ModuleFormType, ModuleFunnelType, ModuleHeaderType,
    ModuleInfoType, ModuleLinksBlockType, ModuleListType, ModuleLogsType, ModuleMiniChatType, ModuleNewsType, ModuleQueueType,
    ModuleRolesType, ModuleScheduleServerCellType, ModuleScheduleType, ModuleTabsType,
    ModuleWidgetsType,
    ModuleYandexMapType
} from "./modules"

//общий тип ответа серверного Api
export type ApiResponseType<data> = {
    status: number,
    data: data,
    detail: any
}
//тип ответа запроса меню
export type ApiMenuType = Array<MenuItemType>
//тип всех возможных модулей, приходящих с сервера
export type ApiModuleType = ModuleHeaderType | ModuleFormType | ModuleInfoType | ModuleListType |
    ModuleWidgetsType | ModuleRolesType | ModuleScheduleType | ModuleTabsType |
    ModuleChatType | ModuleMiniChatType | ModuleCalendarType | ModuleDocumentsType | ModuleFunnelType |
    ModuleNewsType | ModuleLogsType | ModuleLinksBlockType | ModuleAppEditorType | ModuleAccordionType |
    ModuleDayPlanningType | ModuleQueueType | ModuleYandexMapType
//тип ответа запроса страницы
export type ApiPageType = Array<ApiModuleType>
//тип ответа запроса роли 
export type ApiRoleType = {
    article: string,
    id: number,
    permissions: Array<{
        title: string,
        value: number
    }>,
    notificationTypes?: Array<{
        title: string,
        value: number
    }>,
    title: string,
}
//тип запроса доступов 
export type ApiPermissionType = {
    group_description: string | null,
    group_id: number,
    group_parent: number,
    group_title: string,
    permissions: Array<{
        article: string,
        description: string,
        id: number,
        is_checked: boolean,
        title: string
    }>
}
//тип запроса типов уведомлений 
export type ApiNotificationTypesType = Array<{
    article: string,
    id: number,
    title: string,
    is_checked: boolean,
    description?: string
}>
//тип ответа расписания 
export type ApiScheduleType = {
    schedule?: {
        [key: string]: {
            [key: string | number]: {
                performer_id: number,
                performer_href: string,
                performer_title: string,
                initials: {
                    [key: string]: any
                }
                schedule: Array<ModuleScheduleServerCellType>
            }
        }
    },
    steps_list: Array<string>
}
//тип ответа на общий запрос схем БД
export type ApiSchemesType = {
    command: any,
    page: any,
    object: Array<string>,
    db: Array<string>
}
//тип ответа на схему БД (Команда)
export type ApiCommandSchemeType = {
    title: string,
    type: string,
    object_scheme: string,
    modules: Array<string>,
    permissions: Array<string>
}
//тип ответа на схему БД (База)
export type ApiDatabaseSchemeType = {
    title: string,
    properties: Array<{
        title: string,
        article: string,
        type: string,
        is_required: "N" | "Y",
        default: string | null
    }>
}
//тип ответа на схему БД (Объект)
export type ApiObjectSchemeType = {
    title: string,
    table: string,
    is_trash: boolean,
    properties: Array<{
        title: string,
        article: string,
        data_type: string,
        field_type: string
    }>
}
//тип ответа на схему БД (Страница)
export type ApiPageSchemeType = {
    required_modules: Array<string>,
    required_permissions: Array<string>,
    structure: Array<{
        title: string,
        type: string,
        size: number,
        components: any,
        settings: any
    }>
}

//тип ответа инициализационных настроек 
export type ApiSetupType = {
    theme?: string,
    dialog_widget?: {
        groups: { object: string, property: string },
        chats: { object: string, property: string },
        messages: { object: string }
    }
    lang?: "ru" | "en" | "lat",
    currency?: string,
    phone_format?: "ru" | "usa" | "lat",
    global_search?: boolean,
    sign_up?: boolean,
    dom_ru?: boolean,
    google_places?: string,
    salary_widget?: boolean
}

//тип ответа виджетов
export type ApiWidgetType = Array<any> | {report: Array<any>, status: "no_cache" | "updating" | "updated", updated_at: null | string}