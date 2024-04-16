//стандартный тип модуля
export type TDefaultModule<type = string, components = any, settings = any> = {
    settings: settings,
    components: components,
    size: number,
    type: type,
    hook?: string
}