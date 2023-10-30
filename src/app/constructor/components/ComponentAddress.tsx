import { useField, useFormikContext } from "formik";
import React, { useMemo } from "react"
import { AddressSuggestions, DaDataAddress, DaDataSuggestion } from "react-dadata";
import 'react-dadata/dist/react-dadata.css'
import { ComponentAddressType } from "../../types/components";

const ComponentAddress: React.FC<ComponentAddressType> = ({ article, field_type, is_disabled }) => {
    const [field, meta] = useField(article)
    const { onBlur } = field
    const { setFieldValue } = useFormikContext()

    const isError = meta.error && meta.touched
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
    }, [field_type])

    //выжимка нужного значения исходя из типа поля адреса (в значении value содержится полный адрес с учетом страны, города и т.д.)
    const getCurrentTypeValue = (event: DaDataSuggestion<DaDataAddress>) => {
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
    }

    const handleChange = (event?: DaDataSuggestion<DaDataAddress>) => {
        if (event) {
            setFieldValue(article, getCurrentTypeValue(event))
        }
    }

    return <AddressSuggestions
        token="e4f7fbcbf49276babe7b49b636c34a51e07afb81"
        //@ts-ignore
        value={{ value: field.value ?? "" }}
        onChange={handleChange}
        delay={500}
        //@ts-ignore
        filterFromBound={searchLimitation.from}
        //@ts-ignore
        filterToBound={searchLimitation.to}
        filterLocations={[{ "country_iso_code": "*" }]}
        inputProps={{
            name: article,
            className: `form-control form-control-solid${isError ? " invalid" : ""}`,
            onBlur: onBlur,
            disabled: is_disabled
        }}
    />;
}

export default ComponentAddress