import { FormikHandlers, useField, useFormikContext } from "formik"
import React, { useCallback, useEffect, useState } from "react"
import Select, { GroupBase, OptionsOrGroups, components } from "react-select"
import AsyncSelect from 'react-select/async';
import api from "../../api"
import { ComponentSelectType } from "../../types/components"
import { useHook } from "./helpers"
import { useIntl } from "react-intl"
import { isEqual } from "lodash";

type SelectOptionType = { label: string, value: string | number, innerValue?: string | number, menu_label: string }
type SelectValueType = SelectOptionType | Array<SelectOptionType> | null

type TDefaultSelect = {
    placeholder?: string,
    list?: Array<{
        title: string;
        value: string | number | boolean;
        joined_field_value?: string | undefined;
        menu_title?: string | undefined;
    }>, isMulti?: boolean,
    isDisabled?: boolean,
    isVisible?: boolean,
    isClearable?: boolean,
    isDuplicate?: boolean,
    prefix?: string,
    isSearchable?: boolean,
    menuPortal?: boolean,
    isLoading?: boolean,
    joined_field?: string,
    joined_field_filter?: string,
    object?: string,
    select?: Array<string> | string,
    formValue: any,
    joinedFieldValue?: any,
    isError: boolean,
    error?: string,
    handleChange: (value: any) => void,
    handleAppendDuplicate: (label: any, prevValue: any) => void,
    handleBlur: FormikHandlers["handleBlur"]
}

type TSearchSelect = {
    placeholder?: string,
    isMulti?: boolean,
    isDisabled?: boolean,
    isVisible?: boolean,
    isClearable?: boolean,
    search?: string,
    prefix?: string,
    menuPortal?: boolean,
    joined_field?: string,
    joined_field_filter?: string,
    isDuplicate?: boolean,
    isError: boolean,
    formValue: any, joinedFieldValue: any, value: any, error?: string,
    select?: Array<string> | string,
    setValue: (value: any) => void,
    handleChange: (value: any) => void,
    handleAppendDuplicate: (label: any, prevValue: any) => void,
    handleBlur: FormikHandlers["handleBlur"]
}


const DefaultSelect = React.memo<TDefaultSelect>(props => {
    const {
        placeholder,
        list, isMulti,
        isDisabled, isVisible = true, isClearable,
        isDuplicate, prefix,
        isSearchable = true, menuPortal = true, isLoading = false,
        joined_field, formValue, joinedFieldValue, isError,
        error, object, select, joined_field_filter,
        handleChange, handleBlur, handleAppendDuplicate
    } = props
    const [options, setOptions] = useState<Array<any>>([])
    const [previousJoinedFieldValue, setPreviousJoinedFieldValue] = useState<any>(null)
    const [isLoadingOption, setIsLoadingOption] = useState(false)
    const intl = useIntl()

    const resolvedSelect = select ? Array.isArray(select) ? select : [select] : undefined

    const resolvedMenuTargetPortal = menuPortal ? document.body : null
    /* если у поля есть зависимость от другого поля, то отрисовывать только те пункты, которые привязаны к конкретному значению поля, от которого зависимы */
    const getOptions = async () => {
        if (Array.isArray(list) && list.length) {
            const currentOptions = joined_field ?
                list.filter(item => {
                    const currentJoinedFieldValue = joinedFieldValue
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
                    if (object) {
                        if (joined_field) {
                            if (previousJoinedFieldValue !== joinedFieldValue) {
                                setPreviousJoinedFieldValue(joinedFieldValue)
                                const { data } = await api<Array<{ title: string, value: string | number | boolean, menu_title?: string }>>(object, "get",
                                    {
                                        context: { block: "select" },
                                        [joined_field_filter ?? joined_field]: joinedFieldValue,
                                        select: resolvedSelect
                                    }
                                )
                                currentOptions = data.map(item => ({ label: item.title, value: item.value, menu_label: item.menu_title ?? item.title }))
                            }
                        } else if (!options.length) {
                            const { data } = await api<Array<{ title: string, value: string | number | boolean, menu_title?: string }>>(object, "get", { context: { block: "select" }, select: resolvedSelect })
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
    /* list нужно оставить, т.к. бывает асинхронное формирование списка */
    useEffect(() => {
        if (isVisible) {
            getOptions()
        }
    }, [joinedFieldValue, isVisible, list])

    const getValue = () => {
        const value = formValue
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
            onChange={handleChange}
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
            noOptionsMessage={() => intl.formatMessage({ id: "SEARCH.EMPTY_LIST" })}
            openMenuOnClick={false}
            components={isDuplicate ? {
                MultiValueContainer: (props) => {
                    return <components.MultiValueContainer {...props}>
                        {props.children}
                        <div className={`${resolvedClassNamePrefix}__multi-value__add`}
                            role="button"
                            onClick={event => handleAppendDuplicate(props.data, props.selectProps.value)} >+</div>
                    </components.MultiValueContainer>


                }
            } : undefined}
        />
        {isError ? <div className="invalid_feedback">
            {error}
        </div> : null}
    </>
})


const SearchSelect = React.memo<TSearchSelect>(props => {
    const {
        placeholder, isMulti, value, setValue, error,
        isDisabled, isVisible = true,
        isClearable, search, isError, formValue, joinedFieldValue,
        prefix, menuPortal = true, joined_field, joined_field_filter,
        isDuplicate, select, handleBlur, handleChange,
        handleAppendDuplicate,
    } = props



    const intl = useIntl()

    const resolvedClassNamePrefix = `${isError ? "invalid " : ""}${prefix ? `${prefix} ` : ""} ${formValue ? "selected" : ""} componentSelect`
    const resolvedMenuTargetPortal = menuPortal ? document.body : null
    
    const resolvedSelect = select ? Array.isArray(select) ? select : [select] : undefined

    /*
    --- поиск отложенный. Id прошлого timeout хранится в состоянии 
    */
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

    const loadOptions = (inputValue: string, callback: (options: OptionsOrGroups<SelectOptionType, GroupBase<SelectOptionType>>) => void) => {
        if (timeoutId) {
            clearInterval(timeoutId)
        }

        const additionalRequestData = Object
            .assign({ context: { block: "select" }, search: inputValue, select: resolvedSelect  }, joined_field ? { [joined_field_filter ?? joined_field]: joinedFieldValue } : {})
        const id = setTimeout(async () => {
            const response = await api<Array<any>>(search, "search", additionalRequestData)
            callback(response.data.map((item: any) => {
                return isDuplicate ? { label: item.title, innerValue: item.value, value: Math.random(), menu_label: item.menu_title ?? item.title }
                    : { label: item.title, value: item.value, menu_label: item.menu_title ?? item.title }
            }))
            setTimeoutId(null)
        }, 500)
        setTimeoutId(id)
    }

    /*
    --- получения полных инициализационных значений (если потребуются инит табы, просто добавить дубль resolvedInitialValues в defaultOptions)
    */
    const handleInitialValues = async () => {
        const initialIds = formValue ? Array.isArray(formValue) ? formValue : [formValue] : []
        const valueIds = value ? Array.isArray(value) ? value.map(option => isDuplicate ? option.innerValue : option.value) : [value.value] : []
        if (!isEqual(initialIds, valueIds)) {
            const initialValues = await Promise.all(initialIds.map(id => api<Array<any>>(search, "get", { context: { block: "select" }, id, select: resolvedSelect }).then(data => data.data[0])))
            const resolvedInitialValues = initialValues.map((item: { title: string, value: string | number, menu_title?: string }) => {
                return isDuplicate ? { label: item.title, innerValue: item.value, value: Math.random(), menu_label: item.menu_title ?? item.title } :
                    { label: item.title, value: item.value, menu_label: item.menu_title ?? item.title }
            })
            setValue(resolvedInitialValues)
        }

    }

    useEffect(() => {
        if (isVisible) {
            handleInitialValues()
        }
    }, [formValue, isVisible])





    return <>
        <AsyncSelect
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            classNamePrefix={resolvedClassNamePrefix}
            placeholder={placeholder ?? intl.formatMessage({ id: "SEARCH.PLACEHOLDER" })}
            loadingMessage={() => intl.formatMessage({ id: "SEARCH.LOADING" })}
            noOptionsMessage={() => intl.formatMessage({ id: "SEARCH.EMPTY_LIST" })}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            loadOptions={loadOptions}
            isMulti={isMulti}
            isDisabled={isDisabled}
            isClearable={isClearable}
            menuPortalTarget={resolvedMenuTargetPortal}
            maxMenuHeight={150}
            formatOptionLabel={(option, { context }) => <div>{context === "value" ? option.label : option.menu_label}</div>}
            openMenuOnClick={false}
            components={isDuplicate ? {
                MultiValueContainer: (props) => {
                    return <components.MultiValueContainer {...props}>
                        {props.children}
                        <div className={`${resolvedClassNamePrefix}__multi-value__add`}
                            role="button"
                            onClick={event => handleAppendDuplicate(props.data, props.selectProps.value)} >+</div>
                    </components.MultiValueContainer>


                }
            } : undefined}
        />
        {isError ? <div className="invalid_feedback">
            {error}
        </div> : null}
    </>
})


const ComponentSelect: React.FC<ComponentSelectType> = (props) => {
    const { article, hook, onChangeSubmit, customHandler, data_type, isDuplicate } = props
    const { values, handleBlur, setFieldValue, handleSubmit } = useFormikContext<any>()
    const [field, meta] = useField(props.article)
    const isError = Boolean(meta.error && meta.touched)
    const isAsyncSelect = Boolean(props.search)

    const joinedFieldValue = props.joined_field ? values[props.joined_field] : null

    const [value, setValue] = useState<SelectValueType>(null)

    const setValueForHook = useHook(article, values, setFieldValue, hook)

    const handleAsyncChange = useCallback((value: SelectValueType) => {
        if (customHandler) {
            return customHandler(value)
        } else {
            const isCleaningValue = value === null || (Array.isArray(value) && !value.length)
            const resolvedValue = value ? Array.isArray(value) ? value.map(option => (isDuplicate && option.innerValue) ? option.innerValue : option.value) : value.value : value
            if (isCleaningValue) {
                setValue(null)
                setFieldValue(article, null)
            } else {
                setValue(value)
                setFieldValue(article, resolvedValue)
            }

            if (hook) {
                setValueForHook(resolvedValue)
            }

            if (onChangeSubmit) {
                handleSubmit()
            }
        }
    }, [])


    const handleChange = useCallback((value: SelectValueType) => {
        if (customHandler) {
            return customHandler(value)
        } else {
            if (value === null) {
                setFieldValue(article, value)
            } else {
                const resolvedValue = Array.isArray(value) ? value.map(option => (isDuplicate && option.innerValue) ? option.innerValue : option.value) : value.value
                /* переработать преобразование типов */
                /* const valueInCurrentFormat = data_type === "integer" ? Number(resolvedValue) : data_type === "boolean" ? Boolean(resolvedValue) : resolvedValue */
                setFieldValue(article, resolvedValue)
                if (hook) {
                    setValueForHook(resolvedValue)
                }
            }

            if (onChangeSubmit) {
                handleSubmit()
            }
        }
    }, [])

    const handleAppendDuplicate = useCallback((currentLabel: SelectOptionType, prevValue: Array<SelectOptionType>) => {
        const newCurrentLabelInstance = { ...currentLabel, value: Math.random() }
        const value = prevValue.concat(newCurrentLabelInstance)
        if (customHandler) {
            return customHandler(value)
        } else {
            const resolvedValue = value.map(option => option.innerValue)
            if (isAsyncSelect) {
                setValue(value)
            }
            setFieldValue(article, resolvedValue)
            if (hook) {
                setValueForHook(resolvedValue)
            }


            if (onChangeSubmit) {
                handleSubmit()
            }
        }
    }, [])



    if (isAsyncSelect) {
        return <SearchSelect
            placeholder={props.placeholder}
            isMulti={props.isMulti}
            value={value}
            setValue={setValue}
            error={meta.error}
            isDisabled={props.isDisabled}
            isVisible={props.isVisible}
            isClearable={props.isClearable}
            search={props.search}
            isError={isError}
            formValue={field.value}
            joinedFieldValue={joinedFieldValue}
            prefix={props.prefix}
            menuPortal={props.menuPortal}
            handleBlur={handleBlur}
            handleChange={handleAsyncChange}
            handleAppendDuplicate={handleAppendDuplicate}
            joined_field={props.joined_field}
            joined_field_filter={props.joined_field_filter}
            isDuplicate={props.isDuplicate}
            select={props.select}
        />
    } else {
        return <DefaultSelect
            placeholder={props.placeholder}
            isMulti={props.isMulti}
            error={meta.error}
            isDisabled={props.isDisabled}
            isVisible={props.isVisible}
            isClearable={props.isClearable}
            isError={isError}
            formValue={field.value}
            joinedFieldValue={joinedFieldValue}
            prefix={props.prefix}
            menuPortal={props.menuPortal}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleAppendDuplicate={handleAppendDuplicate}
            joined_field={props.joined_field}
            joined_field_filter={props.joined_field_filter}
            isDuplicate={props.isDuplicate}
            isLoading={props.isLoading}
            isSearchable={props.isSearchable}
            list={props.list}
            object={props.object}
            select={props.select}
        />
    }
}

export default ComponentSelect
