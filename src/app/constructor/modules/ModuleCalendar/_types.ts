import { TDefaultModule } from "../_types"
import { TComponentButton } from "../../components/ComponentButton/_types"
import { TComponentFilter } from "../../components/ComponentFilters/_types"


export type TModuleCalendar = TDefaultModule<"calendar", { filters: Array<TComponentFilter>, buttons: Array<TComponentButton> }, {
    object: string,
    events: { add: string, update: string },
    context_keys: Array<string>,
    filters: any
}>