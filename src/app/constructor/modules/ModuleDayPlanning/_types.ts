import { TDefaultModule } from "../_types"
import { TComponentButton } from "../../components/ComponentButton/_types"


export type TModuleDayPlanningLink = {
    link: string,
    title: string,
    setSelectedPage: (value: string | null) => void
}
export type TModuleDayPlanningRow = {
    body: string,
    color: string,
    description: string,
    id: string | number,
    links: Array<{ title: string, link: string }>, time: string, buttons?: Array<TComponentButton>,
    setSelectedPage: (value: string | null) => void
}
export type TModuleDayPlanningDate = { date: moment.Moment, filter: any, handleDateClick: (date: moment.Moment) => void }
export type TModuleDayPlanning = TDefaultModule<"day_planning", Array<any>, { object: string, links_property: string, time_from_property: string, time_to_property: string }>