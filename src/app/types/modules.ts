import moment from "moment"
import { ApiDatabaseSchemeType, ApiModuleType, ApiNotificationTypesType, ApiObjectSchemeType, ApiPageSchemeType, ApiPermissionType, ApiRoleType, ApiScheduleType, ApiWidgetType } from "./api"
import { ComponentFilterType, ComponentInfoType, ComponentInputType, ComponentPhoneType, ComponentSelectType } from "./components"
import { TComponentButton } from "../constructor/components/ComponentButton/_types"

//тип модуля по умолчанию. Используется для создания типов конкретных модулей
export type DefaultModuleType<type = string, components = any, settings = any> = {
    settings: settings,
    components: components,
    size: number,
    type: type,
    hook?: string
}

//модуль Header
export type ModuleHeaderType = DefaultModuleType<"header", { buttons: Array<TComponentButton> }, { title: string, description: string }>

//модуль Form
type ModuleFormButtonType = TComponentButton & { settings: { field_place?: string, visible?: boolean } }
type DefaultModuleFormFieldType<field_type = string, settings = null, additionals = {}> = {
    annotation?: string,
    title?: string,
    article: string,
    data_type: string,
    field_type: field_type,
    is_clearable: null | boolean,
    is_required: boolean,
    is_disabled: boolean | null,
    is_visible: boolean,
    description: string | null,
    hook?: string,
    settings: settings,
    value?: string | number | boolean
    size?: number,
    /* от object_id и request_object избавиться после рефакторинга. Свойства нужны для удаления файлов */
    object_id?: string | number,
    request_object?: string
} & additionals
type ModuleFormFieldInputType = DefaultModuleFormFieldType<ComponentInputType["field_type"], null, { min_value?: number, max_value?: number, suffix?: string }>
type ModuleFormFieldTextareaType = DefaultModuleFormFieldType<"textarea", { rows?: number } | null, { min_value?: number, max_value?: number }>
type ModuleFormFieldPriceType = DefaultModuleFormFieldType<"price", null, { min_value?: number, max_value?: number }>
type ModuleFormFieldPhoneType = DefaultModuleFormFieldType<"phone", null, { min_value?: number, max_value?: number, script?: ComponentPhoneType["script"] }>
type ModuleFormFieldDateType = DefaultModuleFormFieldType<"date" | "time" | "datetime" | "month", null, { min_value?: number, max_value?: number }>
type ModuleFormFieldCheckboxType = DefaultModuleFormFieldType<"checkbox", null, { min_value?: number, max_value?: number }>
type ModuleFormFieldSelectType = DefaultModuleFormFieldType<"list", { is_duplicate: boolean, object: string, select: Array<string> | string, select_menu: Array<string> | string } | null, {
    list?: Array<{
        title: string,
        value: string | number,
        joined_field_value?: string,
    }>,
    data_type: ComponentSelectType["data_type"],
    joined_field?: string,
    joined_field_filter?: string,
    on_change_submit?: boolean,
    search?: string
}>
type ModuleFormFieldRadioType = DefaultModuleFormFieldType<"radio", null, {
    list: Array<{
        title: string,
        value: string | number | boolean,
    }>,
}>
type ModuleFormFieldAddressType = DefaultModuleFormFieldType<"dadata_address" | "dadata_country" | "dadata_region" |
    "dadata_local_area" | "dadata_city" | "dadata_street" | "dadata_passport", null, { min_value?: number, max_value?: number }>
type ModuleFormFieldGoogleAddressType = DefaultModuleFormFieldType<"google_address", null, { min_value?: number, max_value?: number }>
type ModuleFormFieldImageType = DefaultModuleFormFieldType<"image", null | { is_multiply?: boolean, allowed_formats?: Array<string>, is_editor?: boolean }, { min_value?: number, max_value?: number }>
type ModuleFormFieldEditorType = DefaultModuleFormFieldType<"editor", null, { min_value?: number, max_value?: number }>
type ModuleFormFieldFileType = DefaultModuleFormFieldType<"file", null | { is_multiply?: boolean }, { min_value?: number, max_value?: number }>
type ModuleFormFieldStringsType = DefaultModuleFormFieldType<"info_strings", null, { min_value?: number, max_value?: number }>
type ModuleFormFieldSmartListType = DefaultModuleFormFieldType<"smart_list", { properties: Array<ModuleFormFieldType>, is_headers_shown?: boolean }, { min_value?: number, max_value?: number }>
type ModuleFormFieldLayoutType = DefaultModuleFormFieldType<"layout", null | { is_edit?: boolean }, { min_value?: number, max_value?: number }>
export type ModuleFormFieldType = (ModuleFormFieldInputType | ModuleFormFieldTextareaType | ModuleFormFieldPriceType |
    ModuleFormFieldPhoneType | ModuleFormFieldDateType | ModuleFormFieldCheckboxType | ModuleFormFieldSelectType |
    ModuleFormFieldAddressType | ModuleFormFieldGoogleAddressType | ModuleFormFieldImageType | ModuleFormFieldEditorType |
    ModuleFormFieldFileType | ModuleFormFieldRadioType | ModuleFormFieldStringsType | ModuleFormFieldSmartListType |
    ModuleFormFieldLayoutType) & { buttons: Array<ModuleFormButtonType>, isFieldVisible: boolean, isFieldDisabled: boolean, fieldDescription?: string }
export type ModuleFormBlockType = {
    title: string,
    fields: Array<ModuleFormFieldType>,
    buttons: Array<ModuleFormButtonType>,
    /* от object_id и request_object избавиться после рефакторинга. Свойства нужны для удаления файлов */
    object_id?: string | number,
    request_object?: string
}
export type ModuleFormAreaType = {
    size: number,
    blocks: Array<ModuleFormBlockType>,
    buttons: Array<ModuleFormButtonType>,
    /* от object_id и request_object избавиться после рефакторинга. Свойства нужны для удаления файлов */
    object_id?: string | number,
    request_object?: string
}
export type ModuleFormType = DefaultModuleType<"form", { buttons: Array<ModuleFormButtonType> }, {
    areas: Array<ModuleFormAreaType>,
    command: string,
    command_type: "add" | "update" | "custom",
    joined_property: string,
    object: string,
    type: "application/json" | "multipart/form-data",
    data?: { [key: string]: any },
    close_after_submit?: boolean,
    is_disabled?: boolean
}>

//модуль Info
export type ModuleInfoFieldType = {
    title: string,
    article: string,
    data_type: ComponentInfoType["data_type"],
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
export type ModuleInfoType = DefaultModuleType<"info", {
    buttons: Array<TComponentButton>
}, {
    areas: Array<ModuleInfoAreaType>,
    command: string,
    joined_property: string,
    object: string
}>

//модуль List
export type ModuleListDownloaderType = {
    title: string,
    handleDownload: (columns: Array<string>) => Promise<void>,
    columns: Array<{ title: string, article: string }>,
}

export type ModuleListUpdateFieldType = {
    title: string,
    article: string,
    field_type: ModuleFormFieldType["field_type"],
    data_type: ComponentSelectType["data_type"],
    list?: Array<{
        title: string,
        value: string | number
    }>,
    customChecked?: boolean,
    customHandler?: (value?: any) => void
}
export type ModuleListUpdateModalType = {
    showModal: boolean,
    hideModal: (value: boolean) => void,
    fields: Array<ModuleListUpdateFieldType>,
    selectedItems: Array<any>
}
export type ModuleListActionButtonsType = {
    data: Array<TComponentButton>
}
export type ModuleListPaginationType = {
    detail: { pages_count: number, rows_count: number } | undefined,
    filter: { page?: number, limit: number }
    setFilter: (values: any) => void
}
export type ModuleListInfiniteScrollType = {
    currentRowsCount?: number,
    rowsCount?: number,
    hasNextPage?: boolean,
    isFetching: boolean,
    fetch: () => void
}
export type ModuleListCellType = {
    article: string,
    type: string,
    row: { [key: string]: any },
    page: string | null,
    filterable: boolean,
    setFilter: (values: any) => void,
    setIndividualPage: (page: string | null) => void
    suffix?: string
}
export type ModuleListHeadersType = Array<{
    title: string,
    article: string,
    type: string,
    suffix?: string
}>
export type ModuleListRowType = {
    data: { [key: string]: any },
    headers: ModuleListHeadersType,
    page: string | null,
    filterKeys: Array<string>,
    isListEditable: boolean,
    setFilter: (values: any) => void,
    setIndividualPage: (page: string | null) => void
}
export type ModuleListHeaderCellType = {
    article: string,
    title: string,
    type: string,
    filter: { sort_by?: string, sort_order?: string },
    setFilter: (values: any) => void,
    isListEditable: boolean
}
export type ModuleListType = DefaultModuleType<"list", { filters: Array<ComponentFilterType>, buttons: Array<TComponentButton>, search?: boolean }, {
    object: string,
    headers: ModuleListHeadersType,
    filters: { [key: string]: any },
    link?: string | false,
    is_csv?: boolean,
    is_exel?: boolean,
    is_edit?: boolean,
    context?: Object,
    linked_filter?: string
    is_infinite: boolean
}>

//модуль Widgets
export type ModuleWidgetsProgressBarModule = {
    type: "progress_bar",
    settings: {
        title: string,
        percent: number
    }
}
export type ModuleWidgetsCharModule = {
    type: "char" | "details_char",
    settings: {
        char: {
            x: Array<string>,
            lines: Array<{ title: string, values: { [key: string]: number } }>
        },
        value_title?: string
    }
}

export type ModuleWidgetsDonutModule = {
    type: "donut",
    settings: {
        char: any
    }
}

export type ModuleWidgetsWidgetGraphModuleType = {
    detail: ModuleWidgetsProgressBarModule | ModuleWidgetsCharModule | ModuleWidgetsDonutModule
}
export type ModuleWidgetsWidgetType = {
    data: {
        value: string | number,
        description: string,
        icon: string,
        prefix: string,
        postfix: Array<any> | {
            icon: string,
            value: string,
            background: string
        },
        type: string,
        background: string,
        detail: Array<any> | ModuleWidgetsWidgetGraphModuleType["detail"],
        size?: number
    }
}

export type ModuleWidgetsViewType = { data?: ApiWidgetType, is_hard: boolean }

export type ModuleWidgetsType = DefaultModuleType<"analytic_widgets",
    { filters: Array<ComponentFilterType>, buttons: Array<TComponentButton> },
    { filters: { [key: string]: any }, widgets_group: string, is_hard: boolean, linked_filter?: string }>

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
export type ModuleRolesType = DefaultModuleType<"roles", Array<any>, Array<any>>

//модуль Schedule 
export type ModuleScheduleEventType = {
    id: number,
    color: string,
    start_at: string,
    end_at: string,
    description: Array<string>,
    details: Array<{ value: string, icon: string }>,
    icons?: Array<string>
}

export type ModuleScheduleServerCellType = {
    steps: Array<number>,
    status: string,
    event?: ModuleScheduleEventType,
    initials?: {
        [key: string]: any
    }
}

export type ModuleScheduleCellType = {
    type: string,
    time: string,
    cell_height: number,
    event?: ModuleScheduleEventType,
    initials?: {
        [key: string]: any
    }
}

export type ModuleScheduleColumnType = {
    performer_href: string,
    performer_title: string,
    initials: {
        [key: string]: any
    }
    schedule: Array<ModuleScheduleCellType>,
}

export type ModuleScheduleComponentCellType = ModuleScheduleCellType & {
    date: string,
    innerInitials?: {
        [key: string]: any
    }
    setSelectedCell: (cell: any) => void
}
export type ModuleScheduleComponentColumnType = ModuleScheduleColumnType & {
    date: string,
    setSelectedCell: (cell: any) => void
}
export type ModuleScheduleDateColumnType = {
    date: string,
    body: Array<ModuleScheduleColumnType>,
    setSelectedCell: (cell: any) => void
}
export type ModuleScheduleStepsColumnType = {
    steps: Array<string>,
    setFilter: (values: any) => void
}
export type ModuleScheduleTableType = {
    steps: Array<string>,
    schedule: Array<{
        header: string,
        body: Array<ModuleScheduleColumnType>,
    }>,
    tableRef: any,
    setSelectedCell: (cell: any) => void,
    setFilter: (values: any) => void
}
export type ModuleScheduleScrollButtonsType = {
    scrollTable: (direction: number) => void
}
export type ModuleScheduleModalType = {
    requestObject: string,
    selectedCell: any,
    setSelectedCell: (value: null) => void
}
export type ModuleScheduleType = DefaultModuleType<"schedule", { filters: Array<ComponentFilterType>, buttons: Array<TComponentButton> }, {
    object: string,
    filters: Object
}>


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
export type ModuleTabsType = DefaultModuleType<"tabs", any, Array<{
    title: string,
    body: Array<ApiModuleType>,
    settings?: {
        counter?: number,
        is_visible?: boolean
    }
}>>

//модуль Chat
export type ModuleChatType = DefaultModuleType<"chat", any, {
    groups: { objects: string, property: string },
    chats: { objects: string, property: string },
    messages: { objects: string }
}>

//модуль MiniChat 
export type ModuleMiniChatType = DefaultModuleType<"mini_chat", any, {
    object: string,
    filter_property: string
}>

//модуль Calendar
export type ModuleCalendarType = DefaultModuleType<"calendar", { filters: Array<ComponentFilterType>, buttons: Array<TComponentButton> }, {
    object: string,
    events: { add: string, update: string },
    context_keys: Array<string>,
    filters: any
}>

//модуль Documents 

export type ModuleDocumentsType = DefaultModuleType<"documents", Array<any>, {
    command: string,
    object: string,
    data: any
    fields_list?: Array<ModuleFormFieldType>
}>

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
export type ModuleFunnelType = DefaultModuleType<"funnel", { filters: Array<ComponentFilterType>, buttons: Array<TComponentButton> }, { object: string, property: string, filter: string }>

//модуль News
export type ModuleNewsCardType = {
    title: string,
    image: string,
    body: string,
    preview: string,
    handleNewsClick: (title: string, image: string, body: string) => void
}
export type ModuleNewsType = DefaultModuleType<"news", Array<any>, { object: string, property_body: string, property_image: string, property_title: string, property_preview: string }>

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
export type ModuleLogsType = DefaultModuleType<"logs", { filters: Array<ComponentFilterType> }, { object: string, filters: Array<any> | Object }>

//модуль LinksBlock 
export type ModuleLinksBlockLinkType = {
    title: string,
    icon: string,
    link: string
}
export type ModuleLinksBlockType = DefaultModuleType<"links_block", Array<any>, { title: string, links: Array<ModuleLinksBlockLinkType> }>

//модуль AppEditor 
export type ModuleAppEditorHandleDropItemType = { type: "field", areaIndex: number, blockIndex: number, source: any } | { type: "block", areaIndex: number, source: any } |
{ type: "area", source: any }

export type ModuleAppEditorFieldType = {
    type: "system" | "custom",
    title: string,
    field_type?: string,
    article: string
}

type ModuleAppEditorBlockType = {
    type: "system" | "custom",
    fields?: Array<ModuleAppEditorFieldType>
}

type ModuleAppEditorAreaType = {
    type: "system" | "custom",
    size: number,
    blocks?: Array<ModuleAppEditorBlockType>
}

export type ModuleAppEditorFieldDataType = {
    areaIndex: number,
    blockIndex: number,
    fieldIndex?: number,
    field?: ModuleAppEditorFieldType
} | null

export type ModuleAppEditorDraggableItemType = { type: "field", areaIndex: number, blockIndex: number, source: any } | { type: "block", areaIndex: number, source: any } |
{ type: "area", areaIndex: number, source: any } | null

export type ModuleAppEditorComponentFieldType = {
    field: ModuleAppEditorFieldType,
    draggableItem: { type: "field" | "block" | "area" } | null
    handleEdit: () => void,
    onDrag: () => void,
    onDrop: () => void
}

export type ModuleAppEditorComponentBlockType = {
    block: ModuleAppEditorBlockType,
    blockIndex: number,
    areaIndex: number,
    draggableItem: ModuleAppEditorDraggableItemType,
    setDraggableItem: React.Dispatch<React.SetStateAction<ModuleAppEditorDraggableItemType>>,
    setFieldData: React.Dispatch<React.SetStateAction<ModuleAppEditorFieldDataType>>,
    onDrop: (item: ModuleAppEditorHandleDropItemType) => void,
    handleDeleteBlock: (areaIndex: number, blockIndex: number) => void,
}

export type ModuleAppEditorComponentAreaType = {
    area: ModuleAppEditorAreaType,
    areaIndex: number,
    selectedScheme: string,
    draggableItem: ModuleAppEditorDraggableItemType,
    setDraggableItem: React.Dispatch<React.SetStateAction<ModuleAppEditorDraggableItemType>>,
    setFieldData: React.Dispatch<React.SetStateAction<ModuleAppEditorFieldDataType>>,
    onDrop: (item: ModuleAppEditorHandleDropItemType) => void,
    handleAppendBlock: (areaIndex: number) => void,
    handleDeleteBlock: (areaIndex: number, blockIndex: number) => void,
    handleDeleteArea: (areaIndex: number) => void
}

export type ModuleAppEditorFieldModalType = {
    fieldData: ModuleAppEditorFieldDataType,
    setFieldData: React.Dispatch<React.SetStateAction<ModuleAppEditorFieldDataType>>,
    handleSubmitField: (field: ModuleAppEditorFieldType) => void,
    handleDeleteField: (areaIndex: number, blockIndex: number, fieldIndex: number) => void
}

export type ModuleAppEditorSchemeModalType = {
    showSchemeModal: boolean,
    setShowSchemeModal: (state: boolean) => void,
    handleAppendScheme: (schemeValues: { title: string, article: string }) => void
}

export type ModuleAppEditorSchemeType = {
    scheme?: {
        title?: string,
        type: "system" | "custom",
        form: Array<ModuleAppEditorAreaType>
    },
    selectedScheme: string
}
export type ModuleAppEditorType = DefaultModuleType<"app_editor", Array<any>>

//модуль Accordion 
export type ModuleAccordionItemType = {
    id: number,
    title: string,
    body: string,
    user_id: { title: string, value: string | number } | null
    mutate: (item: { id: number }) => void,
    handleEdit: (document: { id: number, body: string }) => void
}
export type ModuleAccordionType = DefaultModuleType<"accordion", Array<any>, { object: string, property_title: string, property_body: string, filters: any }>

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
export type ModuleDayPlanningType = DefaultModuleType<"day_planning", Array<any>, { object: string, links_property: string, time_from_property: string, time_to_property: string }>

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
export type ModuleQueueType = DefaultModuleType<"queue", { filters: Array<ComponentFilterType> }, { object: string }>

//модуль YandexMap
export type ModuleYandexMapType = DefaultModuleType<"yandex_map", { filters: Array<ComponentFilterType> }, { object: string, filters: any }>

//модуль Buttons
export type ModuleButtonsType = DefaultModuleType<"buttons", { buttons: Array<TComponentButton> }>