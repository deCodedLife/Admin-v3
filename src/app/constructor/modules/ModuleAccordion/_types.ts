import { TComponentButton } from "../../components/ComponentButton/_types"
import { TDefaultModule } from "../_types"


export type TModuleAccordionItem = {
    id: number,
    title: string,
    body?: string,
    href?: string,
    user_id: { title: string, value: string | number } | null
    mutate: (item: { id: number }) => void,
    handleEdit: (document: { id: number, body: string }) => void
}
export type TModuleAccordion = TDefaultModule<"accordion", { buttons: Array<TComponentButton> }, { object: string, property_title: string, property_body: string, filters: any }> 