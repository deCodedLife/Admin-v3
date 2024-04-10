import { useField, useFormikContext } from "formik"
import React, { useEffect, useMemo, useState } from "react"
import ReactDatePicker, { registerLocale } from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import ru from 'date-fns/locale/ru';
import en from 'date-fns/locale/en-US';
import lv from 'date-fns/locale/lv';

import moment from "moment";
import { hookAfterChange } from "../helpers";
import MaskedInput from "react-text-mask"
import { useIntl } from "react-intl";
import { useSetupContext } from "../../helpers/SetupContext";
import { getDateFormat } from "../../modules/helpers";
import { TComponentDate } from "./_types";

registerLocale("ru", ru)
registerLocale("en", en)
registerLocale("lv", lv)

const ComponentDate: React.FC<TComponentDate> = (props) => {
    const { article, field_type, is_disabled, hook, onBlurSubmit, className = "", custom_format = false, placeholder, customHandler } = props
    const intl = useIntl()
    const { context } = useSetupContext()
    const [field, meta] = useField(article)
    const { values, setFieldValue, handleSubmit } = useFormikContext<any>()
    const { value } = field
    const isError = meta.error && meta.touched
    const currentFormatDate = useMemo(() => {
        const resolvedValue: string | undefined = value?.value ?? value
        if (!resolvedValue) {
            return undefined
        }

        switch (field_type) {
            case "time":
                const currentDate = new Date()
                const currentTimeAsArray = resolvedValue.split(":").map(item => Number(item))
                currentDate.setHours(currentTimeAsArray[0], currentTimeAsArray[1], currentTimeAsArray[2] ?? 0)
                return currentDate
            case "datetime":
                return new Date(resolvedValue.split(" ").join("T"))
            default:
                return new Date(resolvedValue)
        }
        /*
        --- некорректно работает на WebKit 
        */
        /* return resolvedValue ? field_type === "time" ? new Date(moment().format(`YYYY-MM-DD ${resolvedValue}`)) : new Date(resolvedValue) : undefined */
    }, [value])

    const fieldSettings = useMemo(() => {
        switch (field_type) {
            case "month": {
                return {
                    showTimeSelectOnly: false,
                    showTimeSelect: false,
                    showMonthYearPicker: true,
                    valueFormat: "YYYY-MM",
                    fieldFormat: getDateFormat(field_type, context, "field"),
                    visualFormat: getDateFormat(field_type, context, "field"),
                    placeholder: intl.formatMessage({ id: "DATE.MONTH_PLACEHOLDER" }),
                    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]
                }
            }
            case "time":
                return {
                    showTimeSelectOnly: true,
                    showTimeSelect: false,
                    showMonthYearPicker: false,
                    valueFormat: "HH:mm:ss",
                    fieldFormat: getDateFormat(field_type, context, "field"),
                    visualFormat: getDateFormat(field_type, context, "field"),
                    placeholder: intl.formatMessage({ id: "DATE.TIME_PLACEHOLDER" }),
                    mask: [/\d/, /\d/, ":", /\d/, /\d/]
                }
            case "datetime":
                return {
                    showTimeSelectOnly: false,
                    showTimeSelect: true,
                    showMonthYearPicker: false,
                    valueFormat: "YYYY-MM-DD HH:mm:ss",
                    fieldFormat: getDateFormat(field_type, context, "field"),
                    visualFormat: getDateFormat(field_type, context, "field"),
                    placeholder: intl.formatMessage({ id: "DATE.DATE_TIME_PLACEHOLDER" }),
                    mask: [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, ":", /\d/, /\d/]
                }
            default:
                return {
                    showTimeSelectOnly: false,
                    showTimeSelect: false,
                    showMonthYearPicker: false,
                    valueFormat: "YYYY-MM-DD",
                    fieldFormat: getDateFormat("date", context, "field"),
                    visualFormat: custom_format ? "EEEE, dd MMMM" : getDateFormat("date", context, "field"),
                    placeholder: intl.formatMessage({ id: "DATE.DATE_PLACEHOLDER" }),
                    mask: [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]
                }
        }
    }, [field_type])

    /* 
    --- Отслеживание фокуса для потенциального изменения отображения (фильтры в Доке).
    */
    const [isInFocus, setIsInFocus] = useState(false)


    /*
    --- Генерация уникального ключа для ререндера поля (небольшой хак). Ключ меняется при блюре.
    */
    const [maskedInputKey, setMaskedInputKey] = useState(Math.random())

    useEffect(() => {
        setMaskedInputKey(prev => isInFocus ? prev : Math.random())
    }, [isInFocus])


    /*
    --- Шаблонная маска для работы функции pipe в поле (если вместо маски выставить false, то pipe-функция не будет срабатывать)
    */
    const visualMask = useMemo(() => [
        /./, /./, /./, /./, /./, /./,
        /./, /./, /./, /./, /./, /./,
        /./, /./, /./, /./, /./, /./,
        /./, /./, /./, /./, /./, /./,
        /./, /./, /./, /./, /./, /./,
        /./, /./, /./, /./, /./, /./,
    ], [])


    /*
    --- Pipe-функция для поля  
    */

    const handlePipe = (value: string) => value.slice(0, 1).toUpperCase() + value.slice(1)


    const resolvedClassName = `componentDate_input form-control form-control-solid ${isError ? " invalid" : ""} ${className} ${value ? "selected" : ""}`
    return <>
        <ReactDatePicker
            className={resolvedClassName}
            calendarClassName="componentDate"
            popperClassName="componentDate_popper"
            selected={currentFormatDate}
            onChange={(date: Date) => {
                const value = date ? moment(date).format(fieldSettings.valueFormat) : undefined
                setFieldValue(article, value)
                if (hook) {
                    hookAfterChange(article, value, values, setFieldValue, hook)
                }
                if (customHandler) {
                    customHandler(value)
                }
            }}
            onCalendarClose={() => {
                if (onBlurSubmit) {
                    handleSubmit()
                }
                setIsInFocus(false)
            }}
            onFocus={event => setIsInFocus(true)}
            locale={intl.locale}
            showTimeSelectOnly={fieldSettings.showTimeSelectOnly}
            showTimeSelect={fieldSettings.showTimeSelect}
            showMonthYearPicker={fieldSettings.showMonthYearPicker}
            dateFormat={isInFocus ? fieldSettings.fieldFormat : fieldSettings.visualFormat}
            placeholderText={placeholder ?? fieldSettings.placeholder}
            showPopperArrow={false}
            showMonthDropdown
            showYearDropdown
            dropdownMode="scroll"
            disabled={is_disabled}
            todayButton={intl.formatMessage({ id: "DATE.TODAY_BUTTON" })}
            timeCaption={intl.formatMessage({ id: "DATE.TIME_CAPTION" })}
            customInput={<MaskedInput key={maskedInputKey} mask={isInFocus ? fieldSettings.mask : visualMask} guide={false} pipe={handlePipe} />}
            portalId="root"
        />
        {isError ? <div className="invalid_feedback">
            {meta.error}
        </div> : null}
    </>


}

export default ComponentDate