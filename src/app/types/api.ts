import { TMenuItem } from "./global"
import { TModuleAppEditor } from "../constructor/modules/ModuleAppEditor/_types";
import { TModuleDocuments } from "../constructor/modules/ModuleDocuments/_types";
import { TModuleSchedule, TModuleScheduleServerCell } from "../constructor/modules/ModuleSchedule/_types";
import { TModuleWidgets } from "../constructor/modules/ModuleWidgets/_types";
import { TModuleList } from "../constructor/modules/ModuleList/_types";
import { TModuleForm } from "../constructor/modules/ModuleForm/_types";
import { TModuleHeader } from "../constructor/modules/ModuleHeader/_types";
import { TModuleInfo } from "../constructor/modules/ModuleInfo/_types";
import { TModuleRoles } from "../constructor/modules/ModuleRoles/_types";
import { TModuleTabs } from "../constructor/modules/ModuleTabs/_types";
import { TModuleChat } from "../constructor/modules/ModuleChat/_types";
import { TModuleMiniChat } from "../constructor/modules/ModuleMiniChat/_types";
import { TModuleCalendar } from "../constructor/modules/ModuleCalendar/_types";
import { TModuleFunnel } from "../constructor/modules/ModuleFunnel/_types";
import { TModuleNews } from "../constructor/modules/ModuleNews/_types";
import { TModuleLogs } from "../constructor/modules/ModuleLogs/_types";
import { TModuleLinksBlock } from "../constructor/modules/ModuleLinksBlock/_types";
import { TModuleAccordion } from "../constructor/modules/ModuleAccordion/_types";
import { TModuleDayPlanning } from "../constructor/modules/ModuleDayPlanning/_types";
import { TModuleQueue } from "../constructor/modules/ModuleQueue/_types";
import { TModuleYandexMap } from "../constructor/modules/ModuleYandexMap/_types";
import { TModuleButtons } from "../constructor/modules/ModuleButtons/_types";

//общий тип ответа серверного Api
export type TApiResponse<data> = {
    status: number,
    data: data,
    detail: any
}
//тип ответа запроса меню
export type TApiMenu = Array<TMenuItem>
//тип всех возможных модулей, приходящих с сервера
export type TApiModule = TModuleHeader | TModuleForm | TModuleInfo | TModuleList |
    TModuleWidgets | TModuleRoles | TModuleSchedule | TModuleTabs |
    TModuleChat | TModuleMiniChat | TModuleCalendar | TModuleDocuments |
    TModuleFunnel | TModuleNews | TModuleLogs | TModuleLinksBlock |
    TModuleAppEditor | TModuleAccordion | TModuleDayPlanning | TModuleQueue |
    TModuleYandexMap | TModuleButtons
//тип ответа запроса страницы
export type TApiPage = Array<TApiModule>
//тип ответа запроса роли 
export type TApiRole = {
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
export type TApiPermission = {
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
export type TApiNotificationTypes = Array<{
    article: string,
    id: number,
    title: string,
    is_checked: boolean,
    description?: string
}>
//тип ответа расписания 
export type TApiSchedule = {
    schedule?: {
        [key: string]: {
            [key: string | number]: {
                performer_id: number,
                performer_href: string,
                performer_title: string,
                initials: {
                    [key: string]: any
                }
                schedule: Array<TModuleScheduleServerCell>
            }
        }
    },
    steps_list: Array<string>
}
//тип ответа на общий запрос схем БД
export type TApiSchemes = {
    command: any,
    page: any,
    object: Array<string>,
    db: Array<string>
}
//тип ответа на схему БД (Команда)
export type TApiCommandScheme = {
    title: string,
    type: string,
    object_scheme: string,
    modules: Array<string>,
    permissions: Array<string>
}
//тип ответа на схему БД (База)
export type TApiDatabaseScheme = {
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
export type TApiObjectScheme = {
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
export type TApiPageScheme = {
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
export type TApiSetup = {
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
    salary_widget?: boolean,
    footer?: boolean,
    variables?: "multiple" | "single"
}

//тип ответа виджетов
export type TApiWidget = Array<any> | { report: Array<any>, status: "no_cache" | "updating" | "updated", updated_at: null | string }