import { ModuleFormFieldType } from "../../../types/modules"

export type TComponentSmartListProperty = ModuleFormFieldType & { index: number, is_headers_shown?: boolean }
export type TComponentSmartListPropertiesRow = {
    parentArticle: string,
    properties: Array<ModuleFormFieldType>,
    is_headers_shown?: boolean,
    parentIndex: number,
    hook?: string,
    handleDeleteRow: () => void,
}
export type TComponentSmartList = {
    article: string,
    properties: Array<ModuleFormFieldType>,
    hook?: string,
    is_headers_shown?: boolean
}