import { TDefaultModule } from "../_types";
import { TComponentFilter, TComponentFilterList } from "../../components/ComponentFilters/_types"

export type TFilters = { filters: Array<TComponentFilterList>, initialValues: any, handleChange: (values: any) => void }

export type TModuleQueueTalon = {
    id: string,
    is_alert: boolean,
    talon: string,
    cabinet: string,
    voice: string,
    object: string,
    detail: Array<string>
}
export type TModuleQueue = TDefaultModule<"queue", { filters: Array<TComponentFilter> }, { object: string }>