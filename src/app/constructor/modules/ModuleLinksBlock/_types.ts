import { TDefaultModule } from "../_types";

export type TModuleLinksBlockLink = {
    title: string,
    icon: string,
    link: string
}
export type TModuleLinksBlock = TDefaultModule<"links_block", Array<any>, { title: string, links: Array<TModuleLinksBlockLink> }>