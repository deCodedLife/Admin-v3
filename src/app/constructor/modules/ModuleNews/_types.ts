import { TDefaultModule } from "../_types";

export type TModuleNewsCard = {
    title: string,
    image: string,
    body: string,
    preview: string,
    handleNewsClick: (title: string, image: string, body: string) => void
}
export type TModuleNews = TDefaultModule<"news", Array<any>, { object: string, property_body: string, property_image: string, property_title: string, property_preview: string }>