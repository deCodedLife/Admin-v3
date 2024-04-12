export type TComponentInput = {
    article: string,
    field_type: "email" | "password" | "year" | "string" | "integer" | "float",
    is_disabled?: boolean,
    hook?: string,
    onBlurSubmit?: boolean,
    placeholder?: string,
    className?: string,
    suffix?: string,
    customHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export type TStringField = {
    field_type: TComponentInput["field_type"],
    resolvedClassName: string,
    name: string,
    value?: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    is_disabled?: boolean,
    placeholder?: string,
    isError: boolean,
    error?: string
}

export type TNumberField = {
    currencyMask: any,
    resolvedClassName: string,
    name: string,
    value?: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    is_disabled?: boolean,
    placeholder?: string,
    isError: boolean,
    error?: string
}