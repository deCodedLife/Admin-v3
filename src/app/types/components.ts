import React from "react"
import { ModuleFormFieldType } from "./modules"
import { Placement } from "react-bootstrap/esm/types"

//компонент Button



//компонент Error
export type ComponentErrorType = {
    error: {
        message?: string
    }
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
    select?: Array<string> | string,
    select_menu?: Array<string> | string,
    search?: string,
    hook?: string,
    onChangeSubmit?: boolean,
    customHandler?: (value: any) => void,
    prefix?: string,
    menuPortal?: boolean,
    isSearchable?: boolean
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
    hook?: string,
    is_disabled?: boolean,
    script?: {command: string, object: string, properties?: {[key: string] : any}}
    customHandler?: (value: any) => void,
}


//компонент GooglePlaces
export type ComponentGooglePlacesType = {
    article: string,
    is_disabled?: boolean
}


//компонент SmartList 
export type ComponentSmartListPropertyType = ModuleFormFieldType
export type ComponentSmartListPropertiesRowType = {
    parentArticle: string,
    properties: Array<ComponentSmartListPropertyType>,
    is_headers_shown?: boolean,
    parentIndex: number,
    hook?: string,
    handleDeleteRow: () => void,
}
export type ComponentSmartListType = {
    article: string,
    properties: Array<ComponentSmartListPropertyType>,
    hook?: string,
    is_headers_shown?: boolean
}



//компонент Tooltip
export type ComponentTooltipType = {
    title: string | number | React.ReactElement,
    placement?: Placement
    tooltipClassName?: string,
    children: React.ReactElement,
}

