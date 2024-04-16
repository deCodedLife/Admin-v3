import {TModuleFormField} from "../ModuleForm/_types";
import {TComponentSelect} from "../../components/ComponentSelect/_types";
import {TComponentButton} from "../../components/ComponentButton/_types";
import {TComponentFilter} from "../../components/ComponentFilters/_types";
import { TDefaultModule } from "../_types"

export type TModuleListDownloader = {
    title: string,
    handleDownload: (columns: Array<string>) => Promise<void>,
    columns: Array<{ title: string, article: string }>,
}

export type TModuleListUpdateField = {
    title: string,
    article: string,
    field_type: TModuleFormField["field_type"],
    data_type: TComponentSelect["data_type"],
    list?: Array<{
        title: string,
        value: string | number
    }>,
    customChecked?: boolean,
    customHandler?: (value?: any) => void
}
export type TModuleListUpdateModal = {
    showModal: boolean,
    hideModal: (value: boolean) => void,
    fields: Array<TModuleListUpdateField>,
    selectedItems: Array<any>
}
export type TModuleListActionButtons = {
    data: Array<TComponentButton>
}
export type TModuleListPagination = {
    detail: { pages_count: number, rows_count: number } | undefined,
    filter: { page?: number, limit: number }
    setFilter: (values: any) => void
}
export type TModuleListInfiniteScroll = {
    currentRowsCount?: number,
    rowsCount?: number,
    hasNextPage?: boolean,
    isFetching: boolean,
    fetch: () => void
}
export type TModuleListCell = {
    article: string,
    type: string,
    row: { [key: string]: any },
    page: string | null,
    filterable: boolean,
    setFilter: (values: any) => void,
    setIndividualPage: (page: string | null) => void
    suffix?: string
}
export type TModuleListHeaders = Array<{
    title: string,
    article: string,
    type: string,
    suffix?: string
}>
export type TModuleListRow = {
    data: { [key: string]: any },
    headers: TModuleListHeaders,
    page: string | null,
    filterKeys: Array<string>,
    isListEditable: boolean,
    setFilter: (values: any) => void,
    setIndividualPage: (page: string | null) => void
}
export type TModuleListHeaderCell = {
    article: string,
    title: string,
    type: string,
    filter: { sort_by?: string, sort_order?: string },
    setFilter: (values: any) => void,
    isListEditable: boolean
}
export type TModuleList = TDefaultModule<"list", { filters: Array<TComponentFilter>, buttons: Array<TComponentButton>, search?: boolean }, {
    object: string,
    headers: TModuleListHeaders,
    filters: { [key: string]: any },
    link?: string | false,
    is_csv?: boolean,
    is_exel?: boolean,
    is_edit?: boolean,
    context?: Object,
    linked_filter?: string
    is_infinite: boolean
}>