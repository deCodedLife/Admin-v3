import moment from "moment"
import { ApiDatabaseSchemeType, ApiModuleType, ApiNotificationTypesType, ApiObjectSchemeType, ApiPageSchemeType, ApiPermissionType, ApiRoleType, TApiWidget } from "./api"
import { TComponentButton } from "../constructor/components/ComponentButton/_types"
import { TComponentInfo } from "../constructor/components/ComponentInfo/_types"
import { TComponentFilter } from "../constructor/components/ComponentFilters/_types"
import { TComponentInput } from "../constructor/components/ComponentInput/_types"
import { TComponentSelect } from "../constructor/components/ComponentSelect/_types"
import { TComponentPhone } from "../constructor/components/ComponentPhone/_types"
import {TModuleFormField} from "../constructor/modules/ModuleForm/_types";

//тип модуля по умолчанию. Используется для создания типов конкретных модулей
export type TDefaultModule<type = string, components = any, settings = any> = {
    settings: settings,
    components: components,
    size: number,
    type: type,
    hook?: string
}

//модуль Header
export type ModuleHeaderType = TDefaultModule<"header", { buttons: Array<TComponentButton> }, { title: string, description: string }>

//модуль Form


//модуль Info
export type ModuleInfoFieldType = {
    title: string,
    article: string,
    data_type: TComponentInfo["data_type"],
    field_type: string,
    value: string | number | Array<string> | Array<number>
}
export type ModuleInfoBlockType = {
    title: string,
    fields: Array<ModuleInfoFieldType>
}
export type ModuleInfoAreaType = {
    size: number,
    blocks: Array<ModuleInfoBlockType>
}
export type ModuleInfoType = TDefaultModule<"info", {
    buttons: Array<TComponentButton>
}, {
    areas: Array<ModuleInfoAreaType>,
    command: string,
    joined_property: string,
    object: string
}>

//модуль List


//модуль Widgets


//модуль Roles

export type ModuleRolesPermissionCheckboxType = {
    article: string,
    id: number,
    title: string,
    description?: string
}
export type ModuleRolesPermissionRowType = ApiPermissionType
export type ModuleRolesAdministrationAccessType = { permissions_groups: Array<ModuleRolesPermissionRowType> }
export type ModuleRolesPermissionTableType = {
    permissions: Array<ModuleRolesPermissionRowType>
}

export type ModuleRolesNotificationCheckboxType = {
    article: string,
    id: number,
    title: string,
    description?: string
}
export type ModuleRolesNotificationTableType = {
    notifications: ApiNotificationTypesType
}

export type ModuleRolesDetailsModalType = {
    chosenRole: ApiRoleType | null,
    setRole: (clearValue: null) => void,
    refetchRoles: () => void
}
export type ModuleRolesCardType = ApiRoleType & {
    setRole: (role: ApiRoleType) => void,
    handleRemoveRoleClick: (id: number) => void
}
export type ModuleRolesType = TDefaultModule<"roles", Array<any>, Array<any>>

//модуль Schedule 



//модуль Schemes (для разработчиков)
export type ModuleSchemesTabType = {
    type: string,
    schemes: any,
    tabs: Array<any>,
    mutate: (values: any) => void,
    deleteScheme: (values: any) => void
}

export type ModuleSchemesCommandsTabType = {
    schemes: any,
    mutate: (values: any) => void,
    deleteScheme: (values: any) => void
}

export type ModuleSchemesCommandFormType = {
    data: {
        title: string,
        article?: string,
        type: string,
        object_scheme: string,
        modules: Array<string>,
        permissions: Array<string>
    },
    selectedScheme?: string,
    mutate: (values: any) => void,
    deleteScheme?: (values: any) => void
}

export type ModuleSchemesDatabasesTabType = ModuleSchemesCommandsTabType

export type ModuleSchemesDatabaseFormType = {
    data: {
        title: string,
        article?: string,
        properties: ApiDatabaseSchemeType["properties"]
    },
    selectedScheme?: string,
    mutate: (values: any) => void,
    deleteScheme?: (values: any) => void
}

export type ModuleSchemesDatabasePropertyRowType = {
    parentArticle: string,
    rowIndex: number
}

export type ModuleSchemesOblectsTabType = ModuleSchemesCommandsTabType & {
    tabs: Array<any>
}

export type ModuleSchemesObjectFormType = {
    data: {
        title: string,
        article?: string,
        table: string,
        is_trash: boolean,
        properties: ApiObjectSchemeType["properties"]
    },
    selectedScheme?: string,
    databaseTables: Array<any>,
    currentSchemeCommands: Array<string>,
    mutate: (values: any) => void,
    deleteScheme?: (values: any) => void
}

export type ModuleSchemesObjectPropertyRowType = {
    parentArticle: string,
    rowIndex: number,
    databaseTables: Array<any>,
    currentSchemeCommands: Array<string>,
    isLastProperty: boolean
}


export type ModuleSchemesPagesTabType = ModuleSchemesCommandsTabType

export type ModuleSchemesPageFormType = {
    data: {
        section?: string,
        page?: string,
        required_modules: Array<string>,
        required_permissions: Array<string>,
        structure: ApiPageSchemeType["structure"]
    },
    selectedScheme?: string,
    mutate: (values: any) => void,
    deleteScheme?: (values: any) => void
}

export type ModuleSchemesPageStructureRowType = {
    parentArticle: string,
    structure: {
        title: string,
        type: string,
        size: number,
        components: any,
        settings: any
    },
    handleDelete: (structure: any) => void,
    setFieldValue: (article: string, value: any) => void
}

//модуль Tabs
export type ModuleTabsType = TDefaultModule<"tabs", any, Array<{
    title: string,
    body: Array<ApiModuleType>,
    settings?: {
        counter?: number,
        is_visible?: boolean
    }
}>>

//модуль Chat
export type ModuleChatType = TDefaultModule<"chat", any, {
    groups: { objects: string, property: string },
    chats: { objects: string, property: string },
    messages: { objects: string }
}>

//модуль MiniChat 
export type ModuleMiniChatType = TDefaultModule<"mini_chat", any, {
    object: string,
    filter_property: string
}>

//модуль Calendar
export type ModuleCalendarType = TDefaultModule<"calendar", { filters: Array<TComponentFilter>, buttons: Array<TComponentButton> }, {
    object: string,
    events: { add: string, update: string },
    context_keys: Array<string>,
    filters: any
}>

//модуль Documents 



//модуль Funnel
export type ModuleFunnelItemType = {
    id: number,
    title: string,
    description: string,
    currentColumnId: number,
    tags: Array<{ title: string, color: string }>,
    handleOnDrag: (id: number, currentColumnId: number) => void,
    handleClick: (id: number, currentColumnId: number) => void
}
export type ModuleFunnelColumnType = {
    id: number,
    title: string,
    items: Array<any>,
    color: string,
    isItemsFetching: boolean,
    handleOnDrag: (id: number, currentColumnId: number) => void,
    handleOnDrop: (columnId: number) => void
    handleClick: (id: number, currentColumnId: number) => void,
}
export type ModuleFunnelType = TDefaultModule<"funnel", { filters: Array<TComponentFilter>, buttons: Array<TComponentButton> }, { object: string, property: string, filter: string }>

//модуль News
export type ModuleNewsCardType = {
    title: string,
    image: string,
    body: string,
    preview: string,
    handleNewsClick: (title: string, image: string, body: string) => void
}
export type ModuleNewsType = TDefaultModule<"news", Array<any>, { object: string, property_body: string, property_image: string, property_title: string, property_preview: string }>

//модуль Logs
export type ModuleLogsLogType = {
    id: number,
    created_at: string,
    description: string,
    ip: string,
    row_id: number,
    status: string,
    table_name: string,
    users_id: Array<{ title: string, value: number }> | null
}
export type ModuleLogsType = TDefaultModule<"logs", { filters: Array<TComponentFilter> }, { object: string, filters: Array<any> | Object }>

//модуль LinksBlock 
export type ModuleLinksBlockLinkType = {
    title: string,
    icon: string,
    link: string
}
export type ModuleLinksBlockType = TDefaultModule<"links_block", Array<any>, { title: string, links: Array<ModuleLinksBlockLinkType> }>

//модуль AppEditor 



//модуль Accordion 
export type ModuleAccordionItemType = {
    id: number,
    title: string,
    body: string,
    user_id: { title: string, value: string | number } | null
    mutate: (item: { id: number }) => void,
    handleEdit: (document: { id: number, body: string }) => void
}
export type ModuleAccordionType = TDefaultModule<"accordion", Array<any>, { object: string, property_title: string, property_body: string, filters: any }>

//модуль DayPlanning
export type ModuleDayPlanningLinkType = {
    link: string,
    title: string,
    setSelectedPage: (value: string | null) => void
}
export type ModuleDayPlanningRowType = {
    body: string,
    color: string,
    description: string,
    id: string | number,
    links: Array<{ title: string, link: string }>, time: string, buttons?: Array<TComponentButton>,
    setSelectedPage: (value: string | null) => void
}
export type ModuleDayPlanningDateType = { date: moment.Moment, filter: any, handleDateClick: (date: moment.Moment) => void }
export type ModuleDayPlanningType = TDefaultModule<"day_planning", Array<any>, { object: string, links_property: string, time_from_property: string, time_to_property: string }>

//модуль Queue
export type ModuleQueueTalonType = {
    id: string,
    is_alert: boolean,
    talon: string,
    cabinet: string,
    voice: string,
    object: string,
    detail: Array<string>
}
export type ModuleQueueType = TDefaultModule<"queue", { filters: Array<TComponentFilter> }, { object: string }>

//модуль YandexMap
export type ModuleYandexMapType = TDefaultModule<"yandex_map", { filters: Array<TComponentFilter> }, { object: string, filters: any }>

//модуль Buttons
export type ModuleButtonsType = TDefaultModule<"buttons", { buttons: Array<TComponentButton> }>