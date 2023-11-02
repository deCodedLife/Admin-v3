import { Field, FieldProps } from "formik"
import React, { useState } from "react"
import MaskedInput from "react-text-mask"
import { createNumberMask } from "text-mask-addons"
import { ComponentInputNumberType, ComponentInputStringType, ComponentInputType } from "../../types/components"
import ComponentCheckbox from "./ComponentCheckbox"
import { hookAfterChange } from "./helpers"
import { useIntl } from "react-intl"


const ComponentInputString: React.FC<ComponentInputStringType> = ({
    name, value, field_type, touched,
    error, is_disabled, hook, values,
    onBlurSubmit, placeholder = "", className = "",
    onChange, onBlur, setFieldValue,
    handleSubmit
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const intl = useIntl()
    const isError = Boolean(error && touched)
    const getInputType = (field_type: string, showPassword?: boolean) => {
        if (showPassword) {
            return "text"
        } else {
            switch (field_type) {
                case "email":
                case "password":
                    return field_type
                case "year":
                    return "number"
                case "string":
                default:
                    return "text"
            }
        }
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value
        const inputValue = event.target.value
        switch (name) {
            case "first_name":
            case "last_name":
            case "patronymic":
                value = inputValue.slice(0, 1).toUpperCase() + inputValue.slice(1).toLowerCase()
                break
            default:
                value = inputValue
        }
        return setFieldValue(name, value)
    }

    const handleBlur = (event: any) => {
        const value = event?.target.value
        if (hook) {
            hookAfterChange(name, value, values, setFieldValue, hook)
        }
        onBlur(event)
        if (onBlurSubmit) {
            handleSubmit()
        }
    }
    const resolvedClassName = `form-control form-control-solid${isError ? " invalid" : ""} ${className}`
    return <>
        <input
            className={resolvedClassName}
            type={getInputType(field_type, showPassword)}
            name={name}
            value={value ?? ""}
            onChange={onChange ?? handleChange}
            onBlur={handleBlur}
            disabled={is_disabled}
            placeholder={placeholder}
            autoComplete="new-password"
            onWheel={event => event.currentTarget.blur()}

        />
        {
            field_type === "password" ?
                <div className="componentInput_passwordCheckboxContainer">
                    <ComponentCheckbox
                        customChecked={showPassword}
                        customHandler={() => setShowPassword(prev => !prev)}
                        label={intl.formatMessage({ id: "INPUT.SHOW_PASSWORD_LABEL" })} />
                </div> : null
        }
        {isError ? <div className="invalid_feedback">
            {error}
        </div> : null}
    </>
}

const ComponentInputNumber: React.FC<ComponentInputNumberType> = ({
    name, value, field_type, touched,
    error, is_disabled, hook, values,
    onBlurSubmit, placeholder = "", className = "",
    onChange, onBlur, setFieldValue,
    handleSubmit
}) => {
    const isError = Boolean(error && touched)
    const allowDecimal = field_type === "float"

    const defaultMaskOptions = {

        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ' ',
        allowDecimal,
        decimalSymbol: '.',
        decimalLimit: 2,
        //integerLimit: 7, 
        allowNegative: false,
        allowLeadingZeroes: false,
    }
    const currencyMask = createNumberMask({
        ...defaultMaskOptions,
    })

    /*используем собственный обработчик события, т.к. необходимо зачистить строку от пробелов и привести к числу, но именно на "блюре", т.к. иначе невозможно ввести десятичные числа  */
    const handleBlur = (event: any) => {
        const resolvedValue = Number(event?.target.value.replace(/\s+/g, ""))
        setFieldValue(name, resolvedValue)
        if (hook) {
            hookAfterChange(name, resolvedValue, values, setFieldValue, hook)
        }
        onBlur(event)
        if (onBlurSubmit) {
            handleSubmit()
        }
    }
    const resolvedClassName = `form-control form-control-solid${isError ? " invalid" : ""} ${className}`
    return <>
        <MaskedInput
            mask={currencyMask}
            className={resolvedClassName}
            type="text"
            name={name}
            value={value ?? ""}
            onChange={onChange}
            onBlur={handleBlur}
            disabled={is_disabled}
            placeholder={placeholder}
        />
        {isError ? <div className="invalid_feedback">
            {error}
        </div> : null}
    </>
}
//для полей с числами используется обертка для инпута (исключение - поле типа "year"), поэтому разделил на разные компоненты для большего удобства 
const ComponentInput: React.FC<ComponentInputType> = ({ article, field_type, is_disabled, hook, onBlurSubmit, placeholder, className, customHandler }) => {
    const isMaskedInput = field_type === "integer" || field_type === "float"
    return <Field name={article}>
        {(props: FieldProps) => {
            const { name, value, onChange, onBlur } = props.field
            const { error, touched } = props.meta
            const { setFieldValue, values, handleSubmit } = props.form
            return isMaskedInput ?
                <ComponentInputNumber
                    name={name} value={value} field_type={field_type} error={error}
                    touched={touched} is_disabled={is_disabled} hook={hook} values={values}
                    onBlurSubmit={onBlurSubmit} placeholder={placeholder} className={className}
                    onChange={customHandler ?? onChange} onBlur={onBlur} setFieldValue={setFieldValue} handleSubmit={handleSubmit}
                /> :
                <ComponentInputString name={name} value={value} field_type={field_type} error={error}
                    touched={touched} is_disabled={is_disabled} hook={hook} values={values} className={className}
                    onBlurSubmit={onBlurSubmit} placeholder={placeholder} onChange={customHandler} onBlur={onBlur}
                    setFieldValue={setFieldValue} handleSubmit={handleSubmit}
                />
        }}
    </Field>

}

export default ComponentInput