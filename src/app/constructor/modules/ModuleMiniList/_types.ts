import { TComponentFilter } from "../../components/ComponentFilters/_types";
import { TModuleListHeaders } from "../ModuleList/_types";
import { TDefaultModule } from "../_types";

export type TModuleMiniListCell = { title: string, containerClassName: string, value: any }

export type TModuleMiniListMonth = { index: number, month: string, isActive: boolean, handleMonthClick: (monthIndex: number) => void }

export type TModuleMiniList = TDefaultModule<"mini_list", { filters: Array<TComponentFilter> }, {
    object: string,
    headers: TModuleListHeaders,
    filters: { [key: string]: any },
    context?: Object,
    linked_filter?: string
}>