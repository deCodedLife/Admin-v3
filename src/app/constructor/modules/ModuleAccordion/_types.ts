import { TDefaultModule } from "../_types"


export type TModuleAccordionItem = {
    id: number,
    title: string,
    body: string,
    user_id: { title: string, value: string | number } | null
    mutate: (item: { id: number }) => void,
    handleEdit: (document: { id: number, body: string }) => void
}
export type TModuleAccordion = TDefaultModule<"accordion", Array<any>, { object: string, property_title: string, property_body: string, filters: any }>