import {TModuleFormField} from "../../modules/ModuleForm/_types";

export type TComponentSmartListProperty = TModuleFormField & { index: number, is_headers_shown?: boolean }
export type TComponentSmartListPropertiesRow = {
    parentArticle: string,
    properties: Array<TModuleFormField>,
    is_headers_shown?: boolean,
    parentIndex: number,
    hook?: string,
    handleDeleteRow: () => void,
}
export type TComponentSmartList = {
    article: string,
    properties: Array<TModuleFormField>,
    hook?: string,
    is_headers_shown?: boolean
}