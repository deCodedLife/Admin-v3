export type TComponentModal = {
    page?: string | null,
    show: boolean | { [key: string]: any } | null,
    setShow: (value: null | false) => void,
    refresh?: () => void,
    size?: "sm" | "lg" | "xl"
    centered?: boolean
}
export type TContext = {
    setShow: TComponentModal["setShow"],
    refetchPage: () => void,
    initialData: { [key: string]: any },
    insideModal: boolean,
    saveInStorage: boolean
}