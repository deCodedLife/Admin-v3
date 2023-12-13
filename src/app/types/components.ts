import React from "react"
import { ModuleFormFieldType } from "./modules"
import StateManagedSelect from "react-select/dist/declarations/src/stateManager"
import { Placement } from "react-bootstrap/esm/types"

//компонент Button
type DefaultComponentButtonType<type = string, settings = any> = {
    type: type,
    settings: settings & {
        title: string,
        background: "dark" | "light" | "danger" | "warning" | "success" | "gray",
        icon: string,
        attention_modal?: boolean
    },
    defaultLabel?: string,
    className?: string,
    disabled?: boolean,
    customHandler?: () => void
}
type ComponentButtonHrefType = DefaultComponentButtonType<"href", { page: string }>
type ComponentButtonScriptType = DefaultComponentButtonType<"script", {
    object: string,
    command: string,
    data: any,
    href?: string,
}>
type ComponentButtonSubmitType = DefaultComponentButtonType<"submit", { href?: string }>
type ComponentButtonCustomType = DefaultComponentButtonType<"custom", {}>

export type ComponentButtonClassicType = ComponentButtonHrefType | ComponentButtonScriptType | ComponentButtonSubmitType | ComponentButtonCustomType

export type ComponentButtonModalType = DefaultComponentButtonType<"modal",
    {
        insert_to_field?: string,
        refresh_after_submit?: boolean,
        close_after_submit?: boolean,
        close_previous_modal?: boolean,
        modal_size?: "sm" | "lg" | "xl",
        context?: Object,
        page: string
    }
>
export type ComponentButtonPrintType = DefaultComponentButtonType<"print", {
    data: {
        document_article?: string,
        scheme_name: string,
        row_id: string | number,
        is_edit: boolean,
        script?: {
            command: string,
            object: string,
            properties: any
        }
    },
    context?: { [key: string]: any }
}>


export type ComponentButtonDrawerType = DefaultComponentButtonType<"drawer",
    {
        insert_to_field?: string,
        refresh_after_submit?: boolean,
        close_after_submit?: boolean,
        close_previous_modal?: boolean,
        direction?: "top" | "right" | "bottom" | "left"
        context?: Object,
        page: string
    }
>


export type ComponentButtonType = ComponentButtonClassicType | ComponentButtonModalType | ComponentButtonPrintType | ComponentButtonDrawerType


//компонент Error
export type ComponentErrorType = {
    error: {
        message?: string
    }
}

//компонент Filter
type DefaultComponentFilterType<type = string, settings = any> = {
    title: string,
    type: type,
    settings: { size?: number } & settings,
    placeholder?: string,
}
export type ComponentFilterListType = DefaultComponentFilterType<"list", {
    donor_object: string,
    donor_property_title: string,
    is_search: boolean,
    list?: Array<{
        title: string,
        value: string | number
    }>,
    is_multi?: boolean,
    is_clearable?: boolean,
    recipient_property: string,
    filterValues?: any,
}>
type ComponentFilterOtherTypes = DefaultComponentFilterType<"date" | "date_custom" | "price" | "integer" | "checkbox", {
    recipient_property: string,
    filterValues?: any,
}>
export type ComponentFilterType = ComponentFilterListType | ComponentFilterOtherTypes
export type ComponentFiltersType = {
    type: "dropdown" | "block" | "string",
    data: Array<ComponentFilterType>,
    filterValues?: any,
    isInitials: boolean,
    handleChange: (values: any) => void,
    handleReset: () => void
}

//компонент Input 
export type ComponentInputType = {
    article: string,
    field_type: "email" | "password" | "year" | "string" | "integer" | "float",
    is_disabled?: boolean,
    hook?: string,
    onBlurSubmit?: boolean,
    placeholder?: string,
    className?: string,
    suffix?: string,
    customHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

//компонент Info
export type ComponentInfoType = {
    value: string | number | Array<string> | Array<number>,
    data_type: "email" | "string",
    field_type: string
}

//компонент Select
export type ComponentSelectType = {
    article: string,
    data_type: "integer" | "string" | "boolean" | "array",
    placeholder?: string,
    list?: Array<{ title: string, value: string | number | boolean, joined_field_value?: string, menu_title?: string }>,
    isMulti?: boolean,
    isDisabled?: boolean,
    isVisible?: boolean,
    isClearable?: boolean,
    isDuplicate?: boolean,
    isLoading?: boolean,
    joined_field?: string,
    joined_field_filter?: string,
    object?: string,
    select?: string,
    search?: string,
    hook?: string,
    onChangeSubmit?: boolean,
    customHandler?: (value: any) => void,
    prefix?: string,
    menuPortal?: boolean,
    isSearchable?: boolean
}

//компонент Checkbox
export type ComponentCheckboxType = {
    article?: string,
    customChecked?: boolean,
    label?: string,
    description?: string,
    is_disabled?: boolean,
    hook?: string,
    className?: string,
    onChangeSubmit?: boolean,
    customHandler?: () => void
}

//компонент Array 
export type ComponentArrayFieldType = {
    title: string,
    article: string,
    type: string,
    list?: Array<{ title: string, value: string | boolean | number }>,
    isMulti?: boolean,
    resetOnChange?: boolean,
    dependency?: {
        article: string, value: Array<string> | string
    }
    is_required?: boolean,
    size?: number
}
export type ComponentArrayType = {
    label?: string,
    article: string,
    data_type: "string" | "number" | "object",
    fields?: Array<ComponentArrayFieldType>,
    customHandler?: (value: any) => void,
    draggable?: boolean
}

//компонент Textarea
export type ComponentTextareaType = {
    article: string,
    is_disabled?: boolean,
    customHandler?: (value: any) => void,
    rows?: number
}

//компонент Price 
export type ComponentPriceType = {
    article: string,
    data_type: string,
    is_disabled?: boolean,
    hook?: string,
    onBlurSubmit?: boolean,
    placeholder?: string,
    className?: string,
    customHandler?: (value: any) => void,
}

//компонент Phone 
export type ComponentPhoneType = {
    article: string,
    is_disabled?: boolean,
    customHandler?: (value: any) => void,
}

//компонент Address
export type ComponentAddressType = {
    article: string,
    field_type: string,
    is_disabled?: boolean
}

//компонент GooglePlaces
export type ComponentGooglePlacesType = {
    article: string,
    is_disabled?: boolean
}

//компонент Dashboard 
export type ComponentDashboardType = {
    children: Array<React.ReactChild | null | Array<React.ReactChild>> | React.ReactChild | null,
    inverse?: boolean
}

//компонет Date 
export type ComponentDateType = {
    article: string,
    field_type: string,
    custom_format?: boolean,
    is_disabled?: boolean,
    hook?: string,
    onBlurSubmit?: boolean,
    className?: string,
    placeholder?: string,
    customHandler?: (value: any) => void
}

//компонент Radio 
export type ComponentRadioButtonType = {
    title: string,
    isSelected: boolean,
    handleClick: () => void
}
export type ComponentRadioType = {
    article: string,
    list: Array<{ title: string, value: string | number | boolean }>,
    is_disabled?: boolean,
    hook?: string,
}

//компонент SmartList 
export type ComponentSmartListPropertyType = ModuleFormFieldType
export type ComponentSmartListPropertiesRowType = {
    parentArticle: string,
    properties: Array<ComponentSmartListPropertyType>,
    hook?: string,
    handleDeleteRow: () => void
}
export type ComponentSmartListType = {
    article: string,
    properties: Array<ComponentSmartListPropertyType>,
    hook?: string
}

//компонент Image
export type ComponentImageType = { article: string, allowedFormats?: Array<string>, is_multiply?: boolean }

//компонент File
export type ComponentFileType = { article: string, is_multiply?: boolean, request_object?: string, object_id?: number | string }

//компонент Tooltip
export type ComponentTooltipType = {
    title: string | number | React.ReactElement,
    placement?: Placement
    tooltipClassName?: string,
    children: React.ReactElement,
}

//компонент Annotation 
export type ComponentAnnotationType = { annotation: string, placement?: string }