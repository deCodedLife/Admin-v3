export type TComponentDate = {
    article: string,
    field_type: string,
    custom_format?: boolean,
    is_disabled?: boolean,
    is_clearable?: boolean,
    hook?: string,
    onBlurSubmit?: boolean,
    className?: string,
    placeholder?: string,
    customHandler?: (value: any) => void
}