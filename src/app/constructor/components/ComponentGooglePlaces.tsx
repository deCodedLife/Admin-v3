import { useField, useFormikContext } from "formik";
import React, { useMemo } from "react"
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { ComponentGooglePlacesType } from "../../types/components";
import { useSetupContext } from "../helpers/SetupContext";
import { useIntl } from "react-intl";

const ComponentGooglePlaces: React.FC<ComponentGooglePlacesType> = ({ article, is_disabled }) => {
    const intl = useIntl()
    const [field, meta] = useField(article)
    const { setFieldValue } = useFormikContext()
    const isError = meta.error && meta.touched

    const context = useSetupContext()
    const apiKey = context.google_places


    /*
    ---небольшой хак. Поля в подсказках отличаются от formatted_address, поэтому нужно обновить defaultValue
    */
    const uniqKey = useMemo(() => Math.random(), [field.value])

    if (!apiKey) {
        return <input placeholder={intl.formatMessage({id: "GOOGLE_PLACES.WITHOUT_KEY"})} className={`form-control form-control-solid${isError ? " invalid" : ""}`} disabled />
    }
    if (is_disabled) {
        return <input className={`form-control form-control-solid${isError ? " invalid" : ""}`} value={field.value} disabled />
    }

    return <ReactGoogleAutocomplete
        key={uniqKey}
        className={`form-control form-control-solid${isError ? " invalid" : ""}`}
        style={{ width: "100%" }}
        defaultValue={field.value}
        apiKey={apiKey}
        options={{ types: ["address"] }}
        onPlaceSelected={(place: { formatted_address: string }) => setFieldValue(field.name, place.formatted_address)}
    />


}

export default ComponentGooglePlaces