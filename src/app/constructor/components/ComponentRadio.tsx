import React from "react"
import { ComponentRadioButtonType, ComponentRadioType } from "../../types/components"
import { useField, useFormikContext } from "formik"
import { hookAfterChange } from "./helpers"

const ComponentRadioButton: React.FC<ComponentRadioButtonType> = ({ title, isSelected, handleClick }) => {
    const currentClass = `componentRadio_button ${isSelected ? " selected" : ""}`
    return <button className={currentClass} type="button" onClick={handleClick}>{title}</button>
}

const ComponentRadio: React.FC<ComponentRadioType> = ({ article, list, is_disabled, hook }) => {
    const { values, setFieldValue } = useFormikContext<any>()
    const [field] = useField(article)
    const { value: currentValue } = field
    const handleClick = (value: string | number | boolean) => {
        if (!is_disabled) {
            const resolvedValue = currentValue === value ? undefined : value
            setFieldValue(article, resolvedValue)
            if (hook) {
                hookAfterChange(article, resolvedValue, values, setFieldValue, hook)
            }
        }

    }

    return <div className={`componentRadio ${is_disabled ? " disabled" : ""}`}>
        {list.map(({ title, value }) => <ComponentRadioButton key={title} title={title} isSelected={value === currentValue} handleClick={() => handleClick(value)} />)}
    </div>
}

export default ComponentRadio