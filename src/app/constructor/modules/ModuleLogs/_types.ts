import { TDefaultModule } from "../_types";
import { TComponentFilter } from "../../components/ComponentFilters/_types"

export type TModuleLogsLog = {
    id: number,
    created_at: string,
    description: string,
    ip: string,
    row_id: number,
    status: string,
    table_name: string,
    users_id: Array<{ title: string, value: number }> | null
}
export type TModuleLogs = TDefaultModule<"logs", { filters: Array<TComponentFilter> }, { object: string, filters: Array<any> | Object }>