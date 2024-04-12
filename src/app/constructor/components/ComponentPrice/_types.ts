export type TField = {
    placeholder?: string,
    currencyMask: any,
    resolvedClassName: string,
    name: string,
    value?: string,
    is_disabled?: boolean,
    isError: boolean,
    error?: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
}

export type TComponentPrice = {
    article: string,
    data_type: string,
    is_disabled?: boolean,
    hook?: string,
    onBlurSubmit?: boolean,
    placeholder?: string,
    className?: string,
    customHandler?: (value: any) => void,
}