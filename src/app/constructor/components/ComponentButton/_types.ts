type TDefaultComponentButton<type = string, settings = any> = {
    type: type,
    settings: settings & {
        title: string,
        background: "dark" | "primary" | "primary-light" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "gray",
        icon: string,
        attention_modal?: boolean
    },
    defaultLabel?: string,
    className?: string,
    disabled?: boolean,
    customHandler?: () => void
}
type TComponentButtonHref = TDefaultComponentButton<"href", { page: string }>
type TComponentButtonScript = TDefaultComponentButton<"script", {
    object: string,
    command: string,
    data: any,
    href?: string,
}>
export type TComponentButtonSubmit = TDefaultComponentButton<"submit", { href?: string }>
type TComponentButtonCustom = TDefaultComponentButton<"custom", {}>
type TComponentButtonDownload = TDefaultComponentButton<"download", { href: string }>

export type TComponentButtonClassic = TComponentButtonHref | TComponentButtonScript | TComponentButtonSubmit | TComponentButtonCustom | TComponentButtonDownload
export type TComponentButtonModal = TDefaultComponentButton<"modal", {
    insert_to_field?: string,
    refresh_after_submit?: boolean,
    close_after_submit?: boolean,
    close_previous_modal?: boolean,
    modal_size?: "sm" | "lg" | "xl",
    context?: Object,
    page: string
}>
export type TComponentButtonPrint = TDefaultComponentButton<"print", {
    data: {
        document_article?: string,
        scheme_name: string,
        row_id: string | number,
        is_edit: boolean,
        script?: {
            command: string,
            object: string,
            properties: any
        }
    },
    context?: { [key: string]: any },
    afterSubmit?: boolean,
    visible?: boolean
}>
export type TComponentButtonDrawer = TDefaultComponentButton<"drawer", {
    insert_to_field?: string,
    refresh_after_submit?: boolean,
    close_after_submit?: boolean,
    close_previous_modal?: boolean,
    direction?: "top" | "right" | "bottom" | "left"
    context?: Object,
    page: string
}>

export type TComponentButton = TComponentButtonClassic | TComponentButtonModal | TComponentButtonPrint | TComponentButtonDrawer