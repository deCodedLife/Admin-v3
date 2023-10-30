import { useField, useFormikContext } from "formik"
import React from "react"
import MaskedInput from "react-text-mask"
import { createNumberMask } from "text-mask-addons"
import { ComponentPriceType } from "../../types/components"
import { hookAfterChange } from "./helpers"
import { useSetupContext } from "../helpers/SetupContext"

const ComponentPrice: React.FC<ComponentPriceType> = ({article, data_type, hook, is_disabled, onBlurSubmit, placeholder = "", className = "", customHandler}) => {
    const applicationContext = useSetupContext()
    const [field, meta] = useField(article)
    const {name, value, onBlur, onChange} = field
    const {values, setFieldValue, handleSubmit} = useFormikContext()
    const isError = Boolean(meta.error && meta.touched)
    const allowDecimal = data_type === "float"
    const valueSymbol = applicationContext.currency ?? '₽'
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
    const currencyMask = createNumberMask({
        ...defaultMaskOptions,
    })
    

    /*используем собственный обработчик события, т.к. необходимо зачистить строку от пробелов и привести к числу, но именно на "блюре", т.к. иначе невозможно ввести десятичные числа  */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentTargetValue = Number(event?.target.value.replace(/[^\d]/g, ""))
        if (hook) {
            hookAfterChange(name, currentTargetValue, values, setFieldValue, hook)
        }
        if (customHandler) {
            customHandler(currentTargetValue)
        }
        onChange(event)
    }
    const handleBlur = (event: any) => {
        const resolvedValue = Number(event?.target.value.replace(/[^\d]/g, ""))
        setFieldValue(article, resolvedValue)
        if (customHandler) {
            customHandler(resolvedValue)
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
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={is_disabled}
            placeholder={placeholder}
        />
        {isError ? <div className="invalid_feedback">
            {meta.error}
        </div> : null}
    </>
}

export default ComponentPrice