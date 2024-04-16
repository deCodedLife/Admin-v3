import {TApiWidget} from "../../../types/api";
import {TComponentFilter} from "../../components/ComponentFilters/_types";
import {TComponentButton} from "../../components/ComponentButton/_types";
import { TDefaultModule } from "../_types"

export type TModuleWidgetsProgressBar = {
    type: "progress_bar",
    settings: {
        title: string,
        percent: number
    }
}
export type TModuleWidgetsChar = {
    type: "char" | "details_char",
    settings: {
        char: {
            x: Array<string>,
            lines: Array<{ title: string, values: { [key: string]: number } }>
        },
        value_title?: string
    }
}

export type TModuleWidgetsDonut = {
    type: "donut",
    settings: {
        char: any
    }
}

export type TModuleWidgetsWidgetGraphModule = {
    detail: TModuleWidgetsProgressBar | TModuleWidgetsChar | TModuleWidgetsDonut
}
export type TModuleWidgetsWidget = {
    data: {
        value: string | number,
        description: string,
        icon: string,
        prefix: string,
        postfix: Array<any> | {
            icon: string,
            value: string,
            background: string
        },
        type: string,
        background: string,
        detail: Array<any> | TModuleWidgetsWidgetGraphModule["detail"],
        size?: number
    }
}

export type TModuleWidgetsView = { data?: TApiWidget, is_hard: boolean }

export type TModuleWidgetsSimpleReport = { data: Array<any> }

export type TModuleWidgetsHardReport = { data: { report: Array<any>, status: "no_cache" | "updating" | "updated", updated_at: null | string } }

export type TModuleWidgetsToolbar = { updated_at: string | null, status: "no_cache" | "updating" | "updated", handleUpdateHardReport: () => Promise<void> }

export type TModuleWidgets = TDefaultModule<"analytic_widgets",
    { filters: Array<TComponentFilter>, buttons: Array<TComponentButton> },
    { filters: { [key: string]: any }, widgets_group: string, is_hard: boolean, linked_filter?: string }>