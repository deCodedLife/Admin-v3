import { DaDataAddress, DaDataSuggestion  } from "react-dadata";

export type TField = {
    article: string,
    field_type: string,
    value?: string,
    className: string,
    is_disabled?: boolean,
    searchLimitation: { from?: string, to?: string }
    onChange: (event?: DaDataSuggestion<DaDataAddress>) => void,
    onInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur: (event: React.FocusEvent<any, Element>) => void

}

export type TComponentAddress = {
    article: string,
    field_type: string,
    is_disabled?: boolean
}