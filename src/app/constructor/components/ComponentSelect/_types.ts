import { FormikHandlers } from "formik";

export type TSelectOption = { label: string, value: string | number, innerValue?: string | number, menu_label: string }
export type TSelectValue = TSelectOption | Array<TSelectOption> | null

export type TDefaultSelect = {
    placeholder?: string,
    list?: Array<{
        title: string;
        value: string | number | boolean;
        joined_field_value?: string | undefined;
        menu_title?: string | undefined;
    }>, isMulti?: boolean,
    isDisabled?: boolean,
    isVisible?: boolean,
    isClearable?: boolean,
    isDuplicate?: boolean,
    prefix?: string,
    isSearchable?: boolean,
    menuPortal?: boolean,
    isLoading?: boolean,
    joined_field?: string,
    joined_field_filter?: string,
    object?: string,
    select?: Array<string> | string,
    select_menu?: Array<string> | string,
    formValue: any,
    joinedFieldValue?: any,
    isError: boolean,
    error?: string,
    handleChange: (value: any) => void,
    handleAppendDuplicate: (label: any, prevValue: any) => void,
    handleBlur: FormikHandlers["handleBlur"]
}

export type TSearchSelect = {
    placeholder?: string,
    isMulti?: boolean,
    isDisabled?: boolean,
    isVisible?: boolean,
    isClearable?: boolean,
    search?: string,
    prefix?: string,
    menuPortal?: boolean,
    joined_field?: string,
    joined_field_filter?: string,
    isDuplicate?: boolean,
    isError: boolean,
    formValue: any, joinedFieldValue: any, value: any, error?: string,
    select?: Array<string> | string,
    select_menu?: Array<string> | string,
    setValue: (value: any) => void,
    handleChange: (value: any) => void,
    handleAppendDuplicate: (label: any, prevValue: any) => void,
    handleBlur: FormikHandlers["handleBlur"]
}


export type TComponentSelect = {
    article: string,
    data_type: "integer" | "string" | "boolean" | "array",
    placeholder?: string,
    list?: Array<{ title: string, value: string | number | boolean, joined_field_value?: string, menu_title?: string }>,
    isMulti?: boolean,
    isDisabled?: boolean,
    isVisible?: boolean,
    isClearable?: boolean,
    isDuplicate?: boolean,
    isLoading?: boolean,
    joined_field?: string,
    joined_field_filter?: string,
    object?: string,
    select?: Array<string> | string,
    select_menu?: Array<string> | string,
    search?: string,
    hook?: string,
    onChangeSubmit?: boolean,
    customHandler?: (value: any) => void,
    prefix?: string,
    menuPortal?: boolean,
    isSearchable?: boolean
}