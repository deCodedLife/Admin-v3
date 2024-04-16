import {TComponentButton} from "../../components/ComponentButton/_types";
import {TComponentInput} from "../../components/ComponentInput/_types";
import {TComponentPhone} from "../../components/ComponentPhone/_types";
import {TComponentSelect} from "../../components/ComponentSelect/_types";
import {TDefaultModule} from "../../../types/modules";

type TModuleFormButton = TComponentButton & { settings: { field_place?: string, visible?: boolean } }
type TDefaultModuleFormField<field_type = string, settings = null, additionals = {}> = {
    annotation?: string,
    title?: string,
    article: string,
    data_type: string,
    field_type: field_type,
    is_clearable: null | boolean,
    is_required: boolean,
    is_disabled: boolean | null,
    is_visible: boolean,
    description: string | null,
    hook?: string,
    settings: settings,
    value?: string | number | boolean
    size?: number,
    /* от object_id и request_object избавиться после рефакторинга. Свойства нужны для удаления файлов */
    object_id?: string | number,
    request_object?: string
} & additionals
type TModuleFormFieldInput = TDefaultModuleFormField<TComponentInput["field_type"], null, { min_value?: number, max_value?: number, suffix?: string }>
type TModuleFormFieldTextarea = TDefaultModuleFormField<"textarea", { rows?: number } | null, { min_value?: number, max_value?: number }>
type TModuleFormFieldPrice = TDefaultModuleFormField<"price", null, { min_value?: number, max_value?: number }>
type TModuleFormFieldPhone = TDefaultModuleFormField<"phone", null, { min_value?: number, max_value?: number, script?: TComponentPhone["script"] }>
type TModuleFormFieldDate = TDefaultModuleFormField<"date" | "time" | "datetime" | "month", null, { min_value?: number, max_value?: number }>
type TModuleFormFieldCheckbox = TDefaultModuleFormField<"checkbox", null, { min_value?: number, max_value?: number }>
type TModuleFormFieldSelect = TDefaultModuleFormField<"list",
    { is_duplicate: boolean, object: string, select: Array<string> | string, select_menu: Array<string> | string } | null,
    {
        list?: Array<{
            title: string,
            value: string | number,
            joined_field_value?: string,
        }>,
        data_type: TComponentSelect["data_type"],
        joined_field?: string,
        joined_field_filter?: string,
        on_change_submit?: boolean,
        search?: string
    }>
type TModuleFormFieldRadio = TDefaultModuleFormField<"radio", null, {
    list: Array<{
        title: string,
        value: string | number | boolean,
    }>,
}>
type TModuleFormFieldAddress = TDefaultModuleFormField<"dadata_address" | "dadata_country" | "dadata_region" |
    "dadata_local_area" | "dadata_city" | "dadata_street" | "dadata_passport", null, { min_value?: number, max_value?: number }>
type TModuleFormFieldGoogleAddress = TDefaultModuleFormField<"google_address", null, { min_value?: number, max_value?: number }>
type TModuleFormFieldImage = TDefaultModuleFormField<"image",
    null | { is_multiply?: boolean, allowed_formats?: Array<string>, max_size?: number, is_editor?: boolean }, { min_value?: number, max_value?: number }>
type TModuleFormFieldEditor = TDefaultModuleFormField<"editor", null, { min_value?: number, max_value?: number }>
type TModuleFormFieldFile = TDefaultModuleFormField<"file", null | { is_multiply?: boolean, allowed_formats?: Array<string>, max_size?: number }, { min_value?: number, max_value?: number }>
type TModuleFormFieldStrings = TDefaultModuleFormField<"info_strings", null, { min_value?: number, max_value?: number }>
type TModuleFormFieldSmartList = TDefaultModuleFormField<"smart_list", { properties: Array<TModuleFormField>, is_headers_shown?: boolean }, { min_value?: number, max_value?: number }>
type TModuleFormFieldLayout = TDefaultModuleFormField<"layout", null | { is_edit?: boolean }, { min_value?: number, max_value?: number }>
export type TModuleFormField =
    (TModuleFormFieldInput | TModuleFormFieldTextarea | TModuleFormFieldPrice |
        TModuleFormFieldPhone | TModuleFormFieldDate | TModuleFormFieldCheckbox | TModuleFormFieldSelect |
        TModuleFormFieldAddress | TModuleFormFieldGoogleAddress | TModuleFormFieldImage | TModuleFormFieldEditor |
        TModuleFormFieldFile | TModuleFormFieldRadio | TModuleFormFieldStrings | TModuleFormFieldSmartList |
        TModuleFormFieldLayout)
    & { buttons: Array<TModuleFormButton>, isFieldVisible: boolean, isFieldDisabled: boolean, fieldDescription?: string }
export type TModuleFormBlock = {
    title: string,
    fields: Array<TModuleFormField>,
    buttons: Array<TModuleFormButton>,
    /* от object_id и request_object избавиться после рефакторинга. Свойства нужны для удаления файлов */
    object_id?: string | number,
    request_object?: string
}
export type TModuleFormArea = {
    size: number,
    blocks: Array<TModuleFormBlock>,
    buttons: Array<TModuleFormButton>,
    /* от object_id и request_object избавиться после рефакторинга. Свойства нужны для удаления файлов */
    object_id?: string | number,
    request_object?: string
}
export type TModuleForm = TDefaultModule<"form", { buttons: Array<TModuleFormButton> }, {
    areas: Array<TModuleFormArea>,
    command: string,
    command_type: "add" | "update" | "custom",
    joined_property: string,
    object: string,
    type: "application/json" | "multipart/form-data",
    data?: { [key: string]: any },
    close_after_submit?: boolean,
    is_disabled?: boolean
}>