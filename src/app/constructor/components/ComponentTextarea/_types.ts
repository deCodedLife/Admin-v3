export type TField = {
    resolvedClassName: string,
    rows: number,
    article: string,
    value: string,
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void
    isError: boolean,
    error?: string
    is_disabled?: boolean
}

export type TComponentTextarea = {
    article: string,
    is_disabled?: boolean,
    customHandler?: (value: any) => void,
    rows?: number
}