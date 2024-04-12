import { IntlShape } from "react-intl"

export type TComponentImageEditor = { image: File | null, handleUploadEditedPhoto: (image: Blob | null) => void, intl: IntlShape }

export type TComponentImage = { article: string, allowedFormats?: Array<string>, max_size?: number, is_multiply?: boolean, is_editor?: boolean, is_disabled?: boolean }