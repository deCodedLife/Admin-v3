export type TComponentRadioButton = {
    title: string,
    isSelected: boolean,
    handleClick: () => void
}

export type TComponentRadio = {
    article: string,
    list: Array<{ title: string, value: string | number | boolean }>,
    is_disabled?: boolean,
    hook?: string,
}