import { useField, useFormikContext } from "formik"
import React, { useCallback, useMemo } from "react"
import MaskedInput from "react-text-mask"
import { createNumberMask } from "text-mask-addons"
import { ComponentPriceType } from "../../types/components"
import { useHook } from "./helpers"
import { useSetupContext } from "../helpers/SetupContext"

type TField = {
    placeholder?: string,
    currencyMask: any,
    resolvedClassName: string,
    name: string,
    value?: string,
    is_disabled?: boolean,
    isError: boolean,
    error?: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
}

const Field = React.memo<TField>(props => {

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

const ComponentPrice: React.FC<ComponentPriceType> = ({ article, data_type, hook, is_disabled, onBlurSubmit, placeholder = "", className = "", customHandler }) => {
    const { context } = useSetupContext()
    const [field, meta] = useField(article)
    const { name, value, onBlur, onChange } = field
    const { values, setFieldValue, handleSubmit } = useFormikContext()
    const isError = Boolean(meta.error && meta.touched)
    const allowDecimal = data_type === "float"
    const valueSymbol = context.currency ?? '₽'
    const defaultMaskOptions = {
        prefix: '',
        suffix: valueSymbol,
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ' ',
        allowDecimal,
        decimalSymbol: '.',
        decimalLimit: 2,
        //integerLimit: 7, 
        allowNegative: false,
        allowLeadingZeroes: false,
    }
    const currencyMask = useMemo(() => {
        return createNumberMask({ ...defaultMaskOptions })
    }, [])

    const setValueForHook = useHook(article, values, setFieldValue, hook)

    /*используем собственный обработчик события, т.к. необходимо зачистить строку от пробелов и привести к числу, но именно на "блюре", т.к. иначе невозможно ввести десятичные числа  */
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const currentTargetValue = Number(event?.target.value.replace(/[^\d]/g, ""))
        if (hook) {
            setValueForHook(currentTargetValue)
        }
        if (customHandler) {
            customHandler(currentTargetValue)
        }
        onChange(event)
    }, [])


    const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
        const resolvedValue = Number(event.target.value.replace(/[^\d]/g, ""))
        setFieldValue(article, resolvedValue)
        if (customHandler) {
            customHandler(resolvedValue)
        }
        onBlur(event)
        if (onBlurSubmit) {
            handleSubmit()
        }
    }, [])

    const resolvedClassName = `form-control form-control-solid${isError ? " invalid" : ""} ${className}`

    return <Field
        currencyMask={currencyMask}
        name={name}
        placeholder={placeholder}
        value={value}
        resolvedClassName={resolvedClassName}
        handleBlur={handleBlur}
        handleChange={handleChange}
        isError={isError}
        error={meta.error}
        is_disabled={is_disabled}
    />

}

export default ComponentPrice