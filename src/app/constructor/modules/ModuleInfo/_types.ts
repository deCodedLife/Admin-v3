import { TDefaultModule } from "../_types";
import { TComponentButton } from "../../components/ComponentButton/_types"
import { TComponentInfo } from "../../components/ComponentInfo/_types"

export type TModuleInfoField = {
    title: string,
    article: string,
    data_type: TComponentInfo["data_type"],
    field_type: string,
    value: string | number | Array<string> | Array<number>
}
export type TModuleInfoBlock = {
    title: string,
    fields: Array<TModuleInfoField>
}
export type TModuleInfoArea = {
    size: number,
    blocks: Array<TModuleInfoBlock>
}
export type TModuleInfo = TDefaultModule<"info", {
    buttons: Array<TComponentButton>
}, {
    areas: Array<TModuleInfoArea>,
    command: string,
    joined_property: string,
    object: string
}>