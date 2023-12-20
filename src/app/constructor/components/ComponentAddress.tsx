import { useField, useFormikContext } from "formik";
import React, { useCallback, useMemo } from "react"
import { AddressSuggestions, DaDataAddress, DaDataSuggestion } from "react-dadata";
import 'react-dadata/dist/react-dadata.css'
import { ComponentAddressType } from "../../types/components";

type TField = {
    article: string,
    value?: string,
    className: string,
    is_disabled?: boolean,
    searchLimitation: { from?: string, to?: string }
    onChange: (event?: DaDataSuggestion<DaDataAddress>) => void,
    onInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur: (event: React.FocusEvent<any, Element>) => void

}

const Field = React.memo<TField>(props => {
    const { article, value, is_disabled, className, searchLimitation, onChange, onInput, onBlur } = props
    return <AddressSuggestions
        token="e4f7fbcbf49276babe7b49b636c34a51e07afb81"
        //@ts-ignore
        value={{ value: value ?? "" }}
        onChange={onChange}
        delay={500}
        //@ts-ignore
        filterFromBound={searchLimitation.from}
        //@ts-ignore
        filterToBound={searchLimitation.to}
        filterLocations={[{ "country_iso_code": "*" }]}
        inputProps={{
            name: article,
            className,
            onInput,
            onBlur,
            disabled: is_disabled
        }}
    />
})

const ComponentAddress: React.FC<ComponentAddressType> = ({ article, field_type, is_disabled }) => {
    const [field, meta] = useField(article)
    const { onBlur } = field
    const { setFieldValue } = useFormikContext()

    const isError = meta.error && meta.touched
    const resolvedClassName = `form-control form-control-solid${isError ? " invalid" : ""}`
    //ограничения областей поиска для разных типов полей адреса
    const searchLimitation = useMemo(() => {
        switch (field_type) {
            case "dadata_country":
                return { from: "country", to: "country" }
            case "dadata_region":
            case "dadata_local_area":
                return { from: "region", to: "region" }
            case "dadata_city":
                return { from: "city", to: "settlement" }
            case "dadata_street":
                return { from: "street", to: "street" }
            default:
                return { from: undefined, to: undefined }
        }
    }, [])

    //выжимка нужного значения исходя из типа поля адреса (в значении value содержится полный адрес с учетом страны, города и т.д.)
    const getCurrentTypeValue = useCallback((event: DaDataSuggestion<DaDataAddress>) => {
        switch (field_type) {
            case "dadata_region":
            case "dadata_local_area":
                return event.data.region_with_type
            case "dadata_city":
                return event.data.settlement_with_type ?? event.data.city_with_type
            case "dadata_street":
                return event.data.street_with_type
            default:
                return event.value
        }
    }, [])

    const handleChange = useCallback((event?: DaDataSuggestion<DaDataAddress>) => {
        if (event) {
            setFieldValue(article, getCurrentTypeValue(event))
        }
    }, [])

    const handleInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "") {
            setFieldValue(article, event.target.value)
        }
    }, [])

    return <Field
        article={article}
        value={field.value}
        className={resolvedClassName}
        is_disabled={is_disabled}
        searchLimitation={searchLimitation}
        onChange={handleChange}
        onInput={handleInput}
        onBlur={onBlur}
    />;
}

export default ComponentAddress