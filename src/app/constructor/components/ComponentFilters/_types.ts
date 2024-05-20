type TDefaultComponentFilter<type = string, settings = any> = {
    title: string,
    type: type,
    settings: { size?: number, is_visible?: boolean, hook?: string } & settings,
    placeholder?: string,
}

export type TComponentFilterList = TDefaultComponentFilter<"list", {
    donor_object: string,
    donor_property_title: string,
    select_menu?: string | Array<string>
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

type TComponentFilterOther = TDefaultComponentFilter<"date" | "date_custom" | "price" | "integer" | "checkbox", {
    recipient_property: string,
    filterValues?: any,
}>

export type TComponentFilter = TComponentFilterList | TComponentFilterOther

export type TComponentFiltersCustomToggle = { children: any, onClick: (value: any) => void }

export type TComponentFilters = {
    type: "dropdown" | "block" | "string",
    data: Array<TComponentFilter>,
    filterValues?: any,
    isInitials: boolean,
    handleChange: (values: any) => void,
    handleReset: () => void
}