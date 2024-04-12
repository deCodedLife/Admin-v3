export type TComponentArrayField = {
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

export type TField = { field: TComponentArrayField }

export type TComponentArrayFormField = { field: TComponentArrayField, values: any, size?: number }

export type TComponentArrayItem = {
    label?: string,
    value: any,
    isObject: boolean,
    draggable?: boolean,
    handleClick: (value: any) => void,
    handleOnDrag: (value: any) => void,
    handleOnDrop: (value: any) => void,
}

export type TComponentArray = {
    label?: string,
    article: string,
    data_type: "string" | "number" | "object",
    fields?: Array<TComponentArrayField>,
    customHandler?: (value: any) => void,
    draggable?: boolean
}