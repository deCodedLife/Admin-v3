import { useField, useFormikContext } from "formik"
import React from "react"
import { ComponentCheckboxType } from "../../types/components"
import { hookAfterChange } from "./helpers"

const ComponentCheckbox: React.FC<ComponentCheckboxType> = ({article = "custom", customChecked, customHandler, description, label, is_disabled, hook, onChangeSubmit, className = ""}) => {
    const {values, setFieldValue, handleSubmit} = useFormikContext<any>()
    const [field, meta] = useField(article)
    const isChecked = customChecked ?? Boolean(field.value)
    const handleChange = () => {
        customHandler ? customHandler() : setFieldValue(article, !Boolean(field.value))
        if (hook) {
            hookAfterChange(article, !Boolean(field.value), values, setFieldValue, hook)
        }
        if (onChangeSubmit) {
            handleSubmit()
        }
    }
    const resolvedClassNamePrefix = `componentCheckbox form-check form-check-sm form-check-custom form-check-solid ${className}`
    return <label title={description ?? ""} className={resolvedClassNamePrefix}>
    <input className="form-check-input" type="checkbox" value="" name={article} checked={isChecked} onChange={handleChange} disabled={is_disabled}/> 
    {label ?     <span className="form-check-label">{label}</span> : null}
    </label>
}

export default ComponentCheckbox