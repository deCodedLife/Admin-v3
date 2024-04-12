export type TFile = { title: string, extension: string, path: string }

export type TPreviewComponent = { file: TFile, handleDelete: () => void }

export type TComponentFile = { article: string, allowedFormats?: Array<string>, max_size?: number, is_multiply?: boolean, request_object?: string, object_id?: number | string }