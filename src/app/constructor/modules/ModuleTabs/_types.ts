import { TApiModule } from "../../../types/api"
import { TDefaultModule } from "../_types";

type TModuleTabsTab = {
    title: string,
    body: Array<TApiModule>,
    settings?: {
        counter?: number,
        is_visible?: boolean
    }
}

type TModuleTabsSettings = Array<TModuleTabsTab> | {[key: string]: TModuleTabsTab}

export type TModuleTabs = TDefaultModule<"tabs", any, TModuleTabsSettings>