import { useField, useFormikContext } from "formik"
import React, { useCallback } from "react"
import { ComponentCheckboxType } from "../../types/components"
import { useHook } from "./helpers"

type TCheckbox = {
    resolvedClassNamePrefix: string,
    description?: string,
    article: string,
    isChecked: boolean,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    is_disabled?: boolean,
    label?: string
}

const Checkbox = React.memo<TCheckbox>(props => {
    const { description, resolvedClassNamePrefix, article, isChecked, handleChange, is_disabled, label } = props

    return <label title={description ?? ""} className={resolvedClassNamePrefix}>
        <input className="form-check-input" type="checkbox" value="" name={article} checked={isChecked} onChange={handleChange} disabled={is_disabled} />
        {label ? <span className="form-check-label">{label}</span> : null}
    </label>
})

const ComponentCheckbox: React.FC<ComponentCheckboxType> = props => {
    const { article = "custom", customChecked, customHandler, description, label, is_disabled, hook, onChangeSubmit, className = "" } = props
    const { values, setFieldValue, handleSubmit } = useFormikContext<any>()
    const [field, meta] = useField(article)
    const isChecked = customChecked ?? Boolean(field.value)

    const setValueForHook = useHook(article, values, setFieldValue, hook)

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const resolvedValue = event.target.checked
        customHandler ? customHandler() : setFieldValue(article, resolvedValue)
        if (hook) {
            setValueForHook(resolvedValue)
        }
        if (onChangeSubmit) {
            handleSubmit()
        }
    }, [])
   
    const resolvedClassNamePrefix = `componentCheckbox form-check form-check-sm form-check-custom form-check-solid ${className}`
    return <Checkbox
        article={article}
        isChecked={isChecked}
        resolvedClassNamePrefix={resolvedClassNamePrefix}
        description={description}
        is_disabled={is_disabled}
        label={label}
        handleChange={handleChange}
    />
}

export default ComponentCheckbox