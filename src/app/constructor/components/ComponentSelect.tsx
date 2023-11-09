import { useField, useFormikContext } from "formik"
import React, { useEffect, useState } from "react"
import Select, { GroupBase, OptionsOrGroups } from "react-select"
import AsyncSelect from 'react-select/async';
import api from "../../api"
import { ComponentSelectType } from "../../types/components"
import { hookAfterChange } from "./helpers"
import { useIntl } from "react-intl"
import { isEqual } from "lodash";


const DefaultSelect: React.FC<ComponentSelectType> = (props) => {
    const {
        article, data_type, placeholder,
        list, isMulti, onChangeSubmit = false,
        isDisabled, isVisible = true, isClearable,
        isDuplicate, hook, prefix,
        isSearchable = true, menuPortal = true, isLoading = false,
        customHandler
    } = props
    const [options, setOptions] = useState<Array<any>>([])
    const [previousJoinedFieldValue, setPreviousJoinedFieldValue] = useState<any>(null)
    const [isLoadingOption, setIsLoadingOption] = useState(false)
    const [field, meta] = useField(article)
    const { values, handleBlur, setFieldValue, handleSubmit } = useFormikContext<any>()
    const intl = useIntl()
    const isError = Boolean(meta.error && meta.touched)

    const resolvedMenuTargetPortal = menuPortal ? document.body : null
    /* если у поля есть зависимость от другого поля, то отрисовывать только те пункты, которые привязаны к конкретному значению поля, от которого зависимы */
    const getOptions = async () => {
        if (Array.isArray(list) && list.length) {
            const { joined_field } = props
            const currentOptions = joined_field ?
                list.filter(item => {
                    const currentJoinedFieldValue = values[joined_field]
                    if (Array.isArray(currentJoinedFieldValue)) {
                        if (Array.isArray(item.joined_field_value)) {
                            return item.joined_field_value.some(value => currentJoinedFieldValue.map(id => String(id)).includes(String(value)))
                        } else {
                            return currentJoinedFieldValue.some(id => String(item.joined_field_value) === String(id))
                        }
                    } else {
                        if (Array.isArray(item.joined_field_value)) {
                            return item.joined_field_value.map(value => String(value)).includes(String(currentJoinedFieldValue))
                        } else {
                            return String(item.joined_field_value) === String(currentJoinedFieldValue)
                        }
                    }
                })
                    .map(item => ({ label: item.title, value: item.value, menu_label: item.menu_title ?? item.title })) :
                list.map(item => ({ label: item.title, value: item.value, menu_label: item.menu_title ?? item.title }))
            setOptions(currentOptions)
        } else {

            if (!isLoadingOption) {
                try {
                    setIsLoadingOption(true)
                    let currentOptions: Array<any> = options
                    const { object, select, joined_field, joined_field_filter } = props
                    if (object) {
                        if (joined_field) {
                            if (previousJoinedFieldValue !== values[joined_field]) {
                                setPreviousJoinedFieldValue(values[joined_field])
                                const { data } = await api<Array<{ title: string, value: string | number | boolean, menu_title?: string }>>(object, "get",
                                    {
                                        context: { block: "form_list" },
                                        [joined_field_filter ?? joined_field]: values[joined_field],
                                        select: [select]
                                    }
                                )
                                currentOptions = data.map(item => ({ label: item.title, value: item.value, menu_label: item.menu_title ?? item.title }))
                            }
                        } else if (!options.length) {
                            const { data } = await api<Array<{ title: string, value: string | number | boolean, menu_title?: string }>>(object, "get", { context: { block: "form_list" }, select: [select] })
                            currentOptions = data.map(item => ({ label: item.title, value: item.value, menu_label: item.menu_title ?? item.title }))
                        }
                    }
                    setOptions(currentOptions)
                } finally {
                    setIsLoadingOption(false)
                }
            }
        }
    }

    useEffect(() => {
        if (isVisible) {
            getOptions()
        }
    }, [values, isVisible])


    const handleChange = (value: Array<{ label: string, value: string | number, innerValue?: string | number }> | { label: string, value: string | number } | null) => {
        if (value === null) {
            setFieldValue(article, value)
        } else {
            const resolvedValue = Array.isArray(value) ? value.map(option => (isDuplicate && option.innerValue) ? option.innerValue : option.value) : value.value
            const valueInCurrentFormat = data_type === "integer" ? Number(resolvedValue) : data_type === "boolean" ? Boolean(resolvedValue) : resolvedValue
            setFieldValue(article, valueInCurrentFormat)
            if (hook) {
                hookAfterChange(article, valueInCurrentFormat, values, setFieldValue, hook)
            }
        }

        if (onChangeSubmit) {
            handleSubmit()
        }
    }

    const getValue = () => {
        const value = field.value
        const isMultipleValue = Array.isArray(value)
        //возвращать нужно обязательно null в случае того, если не найдем значение в состоянии, т.к. именно null используется для сброса селекта
        if (isMultipleValue) {
            return value.map(item => {
                const foundedOption = options.find(option => String(option.value) === String(item))
                return (isDuplicate && foundedOption) ? { label: foundedOption.label, innerValue: foundedOption.value, value: Math.random() } : foundedOption
            }) ?? null
        } else {
            return options.find(option => String(option.value) === String(value)) ?? null
        }
    }
    const resolvedClassNamePrefix = `${isError ? "invalid " : ""}${prefix ? `${prefix} ` : ""} ${getValue() ? "selected" : ""} componentSelect`

    return <>
        <Select
            classNamePrefix={resolvedClassNamePrefix}
            options={options}
            value={getValue()}
            placeholder={placeholder ?? intl.formatMessage({ id: "SELECT.PLACEHOLDER" })}
            onChange={value => customHandler ? customHandler(value) : handleChange(value)}
            onBlur={handleBlur}
            isMulti={isMulti}
            menuPortalTarget={resolvedMenuTargetPortal}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            isDisabled={isDisabled}
            maxMenuHeight={150}
            isClearable={isClearable}
            isSearchable={isSearchable}
            menuPlacement="auto"
            formatOptionLabel={(option: { label: string, value: any, menu_label: string }, { context }) => <div>{context === "value" ? option.label : option.menu_label}</div>}
            isLoading={isLoading}
        />
        {isError ? <div className="invalid_feedback">
            {meta.error}
        </div> : null}
    </>
}

type SelectOptionType = { label: string, value: string | number, menu_label: string }
type SelectValueType = SelectOptionType | Array<SelectOptionType> | null

const SearchSelect: React.FC<ComponentSelectType> = (props) => {
    const {
        article, placeholder, isMulti,
        onChangeSubmit = false, isDisabled, isVisible = true,
        isClearable, hook, search,
        prefix, menuPortal = true, customHandler
    } = props
    const [value, setValue] = useState<SelectValueType>(null)
    const [field, meta] = useField(article)
    const { values, handleBlur, setFieldValue, handleSubmit } = useFormikContext<any>()
    const intl = useIntl()
    const isError = Boolean(meta.error && meta.touched)
    const resolvedClassNamePrefix = `${isError ? "invalid " : ""}${prefix ? `${prefix} ` : ""} ${field.value ? "selected" : ""} componentSelect`
    const resolvedMenuTargetPortal = menuPortal ? document.body : null

    /*
    --- поиск отложенный. Id прошлого timeout хранится в состоянии 
    */
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

    const loadOptions = (inputValue: string, callback: (options: OptionsOrGroups<SelectOptionType, GroupBase<SelectOptionType>>) => void) => {
        if (timeoutId) {
            clearInterval(timeoutId)
        }
        const { joined_field, joined_field_filter } = props
        const additionalRequestData = Object
            .assign({ context: { block: "select" }, search: inputValue }, joined_field ? { [joined_field_filter ?? joined_field]: values[joined_field] } : {})
        const id = setTimeout(async () => {
            const response = await api<Array<any>>(search, "search", additionalRequestData)
            callback(response.data.map((item: any) => ({ label: item.title, value: item.value, menu_label: item.menu_title ?? item.title })))
            setTimeoutId(null)
        }, 500)
        setTimeoutId(id)
    }

    /*
    --- получения полных инициализационных значений (если потребуются инит табы, просто добавить дубль resolvedInitialValues в defaultOptions)
    */
    const handleInitialValues = async () => {
        const initialIds = field.value ? Array.isArray(field.value) ? field.value : [field.value] : []
        const valueIds = value ? Array.isArray(value) ? value.map(option => option.value) : [value.value] : []
        if (!isEqual(initialIds, valueIds)) {
            const initialValues = await Promise.all(initialIds.map(id => api<Array<any>>(search, "get", { context: { block: "select" }, id }).then(data => data.data[0])))
            const resolvedInitialValues = initialValues.map((item: { title: string, value: string | number, menu_title?: string }) => (
                { label: item.title, value: item.value, menu_label: item.menu_title ?? item.title }
            ))
            setValue(resolvedInitialValues)
        }

    }

    useEffect(() => {
        if (isVisible) {
            handleInitialValues()
        }
    }, [field.value, isVisible])


    const handleChange = (value: SelectValueType) => {
        const isCleaningValue = value === null || (Array.isArray(value) && !value.length)
        const resolvedValue = value ? Array.isArray(value) ? value.map(item => item.value) : value.value : value
        if (isCleaningValue) {
            setValue(null)
            setFieldValue(article, null)
        } else {
            setValue(value)
            setFieldValue(article, resolvedValue)
        }

        if (hook) {
            hookAfterChange(article, resolvedValue, values, setFieldValue, hook)
        }

        if (onChangeSubmit) {
            handleSubmit()
        }
    }


    return <>
        <AsyncSelect
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            classNamePrefix={resolvedClassNamePrefix}
            placeholder={placeholder ?? intl.formatMessage({ id: "SEARCH.PLACEHOLDER" })}
            loadingMessage={() => intl.formatMessage({ id: "SEARCH.LOADING" })}
            noOptionsMessage={() => intl.formatMessage({ id: "SEARCH.EMPTY_LIST" })}
            value={value}
            /* @ts-ignore */
            onChange={value => customHandler ? customHandler(value) : handleChange(value)}
            onBlur={handleBlur}
            loadOptions={loadOptions}
            isMulti={isMulti}
            isDisabled={isDisabled}
            isClearable={isClearable}
            menuPortalTarget={resolvedMenuTargetPortal}
            maxMenuHeight={150}
            formatOptionLabel={(option, { context }) => <div>{context === "value" ? option.label : option.menu_label}</div>}

        />
        {isError ? <div className="invalid_feedback">
            {meta.error}
        </div> : null}
    </>
}


const ComponentSelect: React.FC<ComponentSelectType> = (props) => {
    const isAsyncSelect = Boolean(props.search)

    if (isAsyncSelect) {
        return <SearchSelect {...props} />
    } else {
        return <DefaultSelect {...props} />
    }
}

export default ComponentSelect