import { TDefaultModule } from "../_types";
import { TComponentButton } from "../../components/ComponentButton/_types"
import { TComponentFilter } from "../../components/ComponentFilters/_types"

export type TModuleFunnelItem = {
    id: number,
    title: string,
    description: string,
    currentColumnId: number,
    tags: Array<{ title: string, color: string }>,
    handleOnDrag: (id: number, currentColumnId: number) => void,
    handleClick: (id: number, currentColumnId: number) => void
}
export type TModuleFunnelColumn = {
    id: number,
    title: string,
    items: Array<any>,
    color: string,
    isItemsFetching: boolean,
    handleOnDrag: (id: number, currentColumnId: number) => void,
    handleOnDrop: (columnId: number) => void
    handleClick: (id: number, currentColumnId: number) => void,
}
export type TModuleFunnel = TDefaultModule<"funnel", { filters: Array<TComponentFilter>, buttons: Array<TComponentButton> }, { object: string, property: string, filter: string }>