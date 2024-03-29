import { useField, useFormikContext } from "formik"
import React, { useCallback, useMemo, useState } from "react"
import MaskedInput from "react-text-mask"
import { createNumberMask } from "text-mask-addons"
import { ComponentInputType } from "../../types/components"
import ComponentCheckbox from "./ComponentCheckbox"
import { useHook } from "./helpers"
import { useIntl } from "react-intl"


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

type TStringField = {
    field_type: ComponentInputType["field_type"],
    resolvedClassName: string,
    name: string,
    value?: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    is_disabled?: boolean,
    placeholder?: string,
    isError: boolean,
    error?: string
}

type TNumberField = {
    currencyMask: any,
    resolvedClassName: string,
    name: string,
    value?: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    is_disabled?: boolean,
    placeholder?: string,
    isError: boolean,
    error?: string
}

const StringField = React.memo<TStringField>(props => {
    const { resolvedClassName, field_type, name, value, handleChange, handleBlur, is_disabled, placeholder, isError, error } = props

    const [showPassword, setShowPassword] = useState(false)
    const intl = useIntl()

    return <>
        <input
            className={resolvedClassName}
            type={getInputType(field_type, showPassword)}
            name={name}
            value={value ?? ""}
            onChange={handleChange}
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
})



const NumberField = React.memo<TNumberField>(props => {

    const { currencyMask, resolvedClassName, name, value, handleChange, handleBlur, is_disabled, placeholder, isError, error } = props

    return <>
        <MaskedInput
            mask={currencyMask}
            className={resolvedClassName}
            type="text"
            name={name}
            value={value ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={is_disabled}
            placeholder={placeholder}
        />
        {isError ? <div className="invalid_feedback">
            {error}
        </div> : null}
    </>
})



const ComponentInput: React.FC<ComponentInputType> = props => {
    const { article, field_type, is_disabled, hook, onBlurSubmit, placeholder, className, suffix, customHandler } = props
    const { values, setFieldValue, handleSubmit } = useFormikContext<any>()
    const [{ name, value, onBlur }, { error, touched }] = useField(article)
    const isMaskedInput = field_type === "integer" || field_type === "float"
    const isError = Boolean(error && touched)
    const resolvedClassName = `form-control form-control-solid${isError ? " invalid" : ""} ${className}`

    const setValueForHook = useHook(name, values, setFieldValue, hook)

    const currencyMask = useMemo(() => {
        if (!isMaskedInput) {
            return null
        } else {
            const allowDecimal = field_type === "float"

            const defaultMaskOptions = {
                prefix: '',
                suffix: suffix ?? '',
                includeThousandsSeparator: true,
                thousandsSeparatorSymbol: ' ',
                allowDecimal,
                decimalSymbol: '.',
                decimalLimit: 2,
                //integerLimit: 7, 
                allowNegative: false,
                allowLeadingZeroes: false,
            }
            return createNumberMask({
                ...defaultMaskOptions,
            })
        }
    }, [isMaskedInput])

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (customHandler) {
            return customHandler(event)
        } else {
            if (isMaskedInput) {
                const resolvedValue = Number(event?.target.value.replace(/[^\d]/g, ""))
                return setFieldValue(name, resolvedValue)
            } else {
                const inputValue = event.target.value
                if (inputValue === "") {
                    return setFieldValue(name, null)
                } else {
                    let resolvedValue
                    switch (name) {
                        case "first_name":
                        case "last_name":
                        case "patronymic":
                            resolvedValue = inputValue.slice(0, 1).toUpperCase() + inputValue.slice(1).toLowerCase()
                            break
                        default:
                            resolvedValue = inputValue
                    }
                    return setFieldValue(name, resolvedValue)
                }

            }
        }
    }, [])

    const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        const resolvedValue = isMaskedInput ? Number(event?.target.value.replace(/[^\d]/g, "")) : event.target.value

        if (hook) {
            setValueForHook(resolvedValue)
        }

        onBlur(event)

        if (onBlurSubmit) {
            handleSubmit()
        }
    }, [])



    if (isMaskedInput) {
        return <NumberField
            resolvedClassName={resolvedClassName}
            name={name}
            value={value}
            handleChange={handleChange}
            handleBlur={handleBlur}
            isError={isError}
            error={error}
            is_disabled={is_disabled}
            placeholder={placeholder}
            currencyMask={currencyMask}
        />
    } else {
        return <StringField
            resolvedClassName={resolvedClassName}
            name={name}
            value={value}
            handleChange={handleChange}
            handleBlur={handleBlur}
            isError={isError}
            error={error}
            is_disabled={is_disabled}
            placeholder={placeholder}
            field_type={field_type}
        />
    }



}

export default ComponentInput