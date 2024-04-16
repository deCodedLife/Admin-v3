import {TComponentFilter} from "../../components/ComponentFilters/_types";
import {TComponentButton} from "../../components/ComponentButton/_types";
import { TDefaultModule } from "../_types"

export type TModuleScheduleEvent = {
    id: number,
    color: string,
    start_at: string,
    end_at: string,
    description: Array<string>,
    details: Array<{ value: string, icon: string }>,
    icons?: Array<string>
}

export type TModuleScheduleServerCell = {
    steps: Array<number>,
    status: string,
    event?: TModuleScheduleEvent,
    initials?: {
        [key: string]: any
    }
}

export type TModuleScheduleCell = {
    type: string,
    time: string,
    cell_height: number,
    event?: TModuleScheduleEvent,
    initials?: {
        [key: string]: any
    }
}

export type TModuleScheduleColumn = {
    performer_href: string,
    performer_title: string,
    initials: {
        [key: string]: any
    }
    schedule: Array<TModuleScheduleCell>,
}

export type TModuleScheduleComponentCell = TModuleScheduleCell & {
    date: string,
    innerInitials?: {
        [key: string]: any
    }
    setSelectedCell: (cell: any) => void
}
export type TModuleScheduleComponentColumn = TModuleScheduleColumn & {
    date: string,
    setSelectedCell: (cell: any) => void
}
export type TModuleScheduleDateColumn = {
    date: string,
    body: Array<TModuleScheduleColumn>,
    setSelectedCell: (cell: any) => void
}
export type TModuleScheduleStepsColumn = {
    steps: Array<string>,
    setFilter: (values: any) => void
}
export type TModuleScheduleTable = {
    steps: Array<string>,
    schedule: Array<{
        header: string,
        body: Array<TModuleScheduleColumn>,
    }>,
    tableRef: any,
    setSelectedCell: (cell: any) => void,
    setFilter: (values: any) => void
}
export type TModuleScheduleScrollButtons = {
    scrollTable: (direction: number) => void
}
export type TModuleScheduleModal = {
    requestObject: string,
    selectedCell: any,
    setSelectedCell: (value: null) => void
}
export type TModuleSchedule = TDefaultModule<"schedule", { filters: Array<TComponentFilter>, buttons: Array<TComponentButton> }, {
    object: string,
    filters: Object
}>