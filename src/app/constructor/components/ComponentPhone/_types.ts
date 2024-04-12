export type TComponentPhone = {
    article: string,
    hook?: string,
    is_disabled?: boolean,
    script?: {command: string, object: string, properties?: {[key: string] : any}}
    customHandler?: (value: any) => void,
}