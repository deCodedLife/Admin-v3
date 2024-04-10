export type TCheckbox = {
    resolvedClassNamePrefix: string,
    description?: string,
    article: string,
    isChecked: boolean,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    is_disabled?: boolean,
    label?: string
}

export type TComponentCheckbox = {
    article?: string,
    customChecked?: boolean,
    label?: string,
    description?: string,
    is_disabled?: boolean,
    hook?: string,
    className?: string,
    onChangeSubmit?: boolean,
    customHandler?: () => void
}