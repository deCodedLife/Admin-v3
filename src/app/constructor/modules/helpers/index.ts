import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { conformToMask } from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';
import * as Yup from 'yup';
import { ModuleFormAreaType, ModuleFormFieldType } from '../../../types/modules';
import { isEqual } from 'lodash';
import { ApiSetupType } from '../../../types/api';

//функция для получения массива полей из схемы формы
export const getFields = (areas: Array<ModuleFormAreaType>) => {
    return areas?.reduce((acc: Array<ModuleFormFieldType>, area) => acc.concat(area?.blocks?.reduce((acc: Array<ModuleFormFieldType>, block) => acc.concat(block.fields), [])), []) ?? []
}
//функция для получения инит. значений из массива полей
export const getInitialValues = (fields: Array<ModuleFormFieldType>, isCreating: boolean, additionalInitials: any = {}) => {
    const initialValues: any = {
        fieldsVisibility: {},
        fieldsDescriptions: {},
        fieldsDisabled: {}
    }
    fields.forEach((field) => {
        if (field.is_required) {
            initialValues[field.article] = field.value ?? undefined
        } else if (field.value || field.value === 0 || field.value === false) {
            initialValues[field.article] = field.value
        }
        initialValues.fieldsVisibility[field.article] = field.is_visible
        initialValues.fieldsDescriptions[field.article] = field.description
        initialValues.fieldsDisabled[field.article] = field.is_disabled
    })
    return isCreating ? Object.assign({}, initialValues, additionalInitials) : Object.assign({}, additionalInitials, initialValues)
}
//функция для получения схемы валидации определенного поля
const getFieldValidation = (field: ModuleFormFieldType) => {
    const pattern = ["isArray", "type", "length", "isRequired", "isPassword", "isEmail"]
    const value = pattern.reduce((acc, step) => {
        switch (step) {
            case "isArray":
                //@ts-ignore
                return field.data_type === "array" ? acc.array() : acc
            case "type":
                //@ts-ignore
                return field.data_type === "array" ? acc.of(Yup.string()) : field.data_type === "integer" ? acc.number() : acc.string()
            case "length":
                //нужно либо передавать значение длины в том числе селектам, либо сделать универсальное исключение, т.к. list - это только один из типов
                const haveMaxLength = Boolean(field.data_type !== "password" && field.field_type !== "list" && field.field_type !== "radio" && field.max_value && field.max_value !== 0)
                //полю типа телефон нужно накинуть максимального значения, т.к. иначе маска, которая "снимается" при блюре поля, вызывает ошибку валидации на этапе ввода
                const isPhone = field.field_type === 'phone'
                //@ts-ignore
                return haveMaxLength ? isPhone ? acc.min(0).max(field.max_value + 6, "Максимальное значение символов - ${max}") : acc.min(0).max(field.max_value, "Максимальное значение символов - ${max}") : acc
            case "isRequired":
                //@ts-ignore
                return field.is_required ? acc.required("Поле обязательно для заполнения").typeError("Поле обязательно для заполнения") : acc.notRequired().nullable()
            case "isPassword":
                //@ts-ignore
                return field.data_type === "password" ? acc.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: "Не менее 8 символов. Минимум 1 строчная, прописная буквы и число" }) : acc
            case "isEmail":
                //@ts-ignore
                return field.data_type === "email" ? acc.email("Введите корректный адрес почты") : acc
        }
    }, Yup)
    return value
}
//функция для получения схемы валидации всей формы
export const getValidationSchema = (fields: Array<ModuleFormFieldType>) => {
    const validationSchema = fields.reduce((acc: any, field) => {
        /* !!! сделать валидацию smart_list */
        if (field.field_type !== "smart_list" && field.field_type !== "image" && field.field_type !== "file") {
            acc[field.article] = getFieldValidation(field)
        }
        return acc
    }, {})
    return Yup.object().shape(validationSchema)
}

//функция форматирования заголовка схемы 
export const titleFileFormatRemover = (name: string) => name.replace(/\.\w+/, "")


//функция для получения маски телефона
export const getMaskedPhone = (format: ApiSetupType["phone_format"]) => {
    switch (format) {
        case "usa":
            return {
                mask: ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
                placeholder: "(___) ___-____",
                pure_length: 10
            }
        case "lat":
            return {
                mask: ['+', '3', '7', "1", '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
                placeholder: "+371-__-___-___",
                pure_length: 11
            }
        case "ru":
        default:
            return {
                mask: ['+', /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
                placeholder: "+7 (___) ___-__-__",
                pure_length: 11
            }
    }
}


//функция для форматирования наложения маски на телефон (строка)
export const getMaskedString = (value: any, type: "phone" | "price", context: ApiSetupType) => {
    if (!value || value === "null" || value === "undefined") {
        return ""
    } else {
        const getCurrentMask = (type: "phone" | "price") => {
            switch (type) {
                case "price":
                    const defaultMaskOptions = {
                        prefix: '',
                        suffix: context.currency ?? '₽',
                        includeThousandsSeparator: true,
                        thousandsSeparatorSymbol: ' ',
                        allowDecimal: true,
                        decimalSymbol: '.',
                        decimalLimit: 2,
                        allowNegative: false,
                        allowLeadingZeroes: false,
                    }
                    return createNumberMask({ ...defaultMaskOptions, })
                case "phone":
                default:
                    return getMaskedPhone(context.phone_format).mask
            }


        }
        const currentMask = getCurrentMask(type)
        return conformToMask(String(value), currentMask, { guide: false }).conformedValue
    }
}


//функция для выдачи формата дат в зависимости от настройки приложения
export const getDateFormat = (type: "time" | "date" | "datetime" | "month", context: ApiSetupType, useIn: "string" | "field") => {
    const { lang } = context
    switch (type) {
        case "time":
            return "HH:mm"
        case "month":
            switch (useIn) {
                case "string":
                    return "MM.YYYY"
                default:
                    return "MM.yyyy"
            }
        case "datetime":
            switch (useIn) {
                case "string":
                    return lang === "en" ? "MM.DD.YYYY г. HH:mm" : "DD.MM.YYYY г. HH:mm"
                default:
                    return lang == "en" ? "MM.dd.yyyy HH:mm" : "dd.MM.yyyy HH:mm"
            }
        default:
            switch (useIn) {
                case "string":
                    return lang === "en" ? "DD.MM.YYYY г." : "MM.DD.YYYY г."
                default:
                    return lang === "en" ? "MM.dd.yyyy" : "dd.MM.yyyy"
            }
    }
}


//кастомный хук для горизонтального скролла
export const useHorizontalScroll = () => {
    const elRef = useRef<HTMLElement>();
    useEffect(() => {
        const el = elRef.current;
        if (el) {
            const onWheel = (e: any) => {
                if (e.deltaY == 0) return;
                e.preventDefault();
                el.scrollTo({
                    left: el.scrollLeft + e.deltaY,

                });
            };
            el.addEventListener("wheel", onWheel);
            return () => el.removeEventListener("wheel", onWheel);
        }
    }, []);
    return elRef;
}

//проверка строки на наличие дат в системном формате и подмена на нормальный формат

export const checkDatesInString = (value: any) => {
    if (value && typeof value === "string") {
        const dates = value.match(/\d+-\d+-\d+/gi)?.map(date => ({
            source: date,
            value: moment(date).format("DD.MM.YYYY")
        }))
        return dates?.length ? dates.reduce((acc, date) => acc.replace(date.source, date.value), value) : value
    } else {
        return value
    }

}

//хук для сохранения фильтров
const getSessionStorageValue = (key: string, initials: Object) => {
    const supposedValue = sessionStorage.getItem(key)
    return Object.assign({}, initials, supposedValue ? JSON.parse(supposedValue) : {})
}
const setSessionStorageValue = (key: string, value: Object) => {
    const stringifiedValue = JSON.stringify(value)
    sessionStorage.setItem(key, stringifiedValue)
    window.dispatchEvent(new Event("storage"))
}

export const useFilter = (moduleKey: string, initials: Object, linked_filter?: string, excludeArticles?: Array<string>) => {
    //moduleKey - уникальный ключ, необходимый для записи значений фильтров в storage. Как правило, достаточно "тип модуля + объект/команда запроса"
    //добавляем к уникальному ключу путь для большей уникальности
    const location = useLocation()
    const resolvedUnicKey = `${location.pathname}${location.search}-${moduleKey}`
    const resolvedInitialValues = initials && !Array.isArray(initials) ? initials : {}

    const [filterValues, setFilter] = useState<any>(getSessionStorageValue(resolvedUnicKey, resolvedInitialValues))
    const handleFilterValuesReset = () => setFilter(resolvedInitialValues)
    useEffect(() => {
        const resolvedValues = { ...filterValues }
        if (!linked_filter && excludeArticles?.length) {
            excludeArticles.forEach(article => delete resolvedValues[article])
        }
        setSessionStorageValue(resolvedUnicKey, resolvedValues)
    }, [filterValues])

    //прослушивание значений фильтров других модулей из sessionStorage
    const moduleFilterValuesListener = useCallback(() => {
        const suppostedListenModueKey = linked_filter ? `${location.pathname}${location.search}-${linked_filter}` : ""
        const excludeArticlesArray = excludeArticles ?? []
        setFilter((prev: any) => {
            const suppostedValueToListen = sessionStorage.getItem(suppostedListenModueKey) ? JSON.parse(sessionStorage.getItem(suppostedListenModueKey) as string) : null
            if (!suppostedValueToListen) {
                return prev
            } else {
                const objectWithExcludes: { [key: string]: any } = {}
                const prevValuesWithoutExcludes = { ...prev }

                excludeArticlesArray.forEach(key => {
                    if (key in prevValuesWithoutExcludes) {
                        objectWithExcludes[key] = prevValuesWithoutExcludes[key]
                        delete prevValuesWithoutExcludes[key]
                    }
                })
                const isValuesEqual = isEqual(suppostedValueToListen, prevValuesWithoutExcludes)
                return isValuesEqual ? prev : Object.assign({}, resolvedInitialValues, suppostedValueToListen, objectWithExcludes)
            }
        })
    }, [])

    useEffect(() => {
        if (linked_filter) {
            window.addEventListener("storage", moduleFilterValuesListener)
            return () => window.removeEventListener("storage", moduleFilterValuesListener)
        }
    }, [])

    return {
        filter: filterValues,
        isInitials: isEqual(filterValues, resolvedInitialValues),
        setFilter,
        resetFilter: handleFilterValuesReset
    }
}

//хук для сохранения поиска
const getSessionStorageSearchValue = (key: string) => {
    const supposedValue = sessionStorage.getItem(key)
    return supposedValue ?? ""
}
const setSessionStorageSearchValue = (key: string, value: string) => sessionStorage.setItem(key, value)

export const useSearch = (key: string) => {
    const location = useLocation()
    const resolvedKey = `${location.pathname}${location.search}-${key}-search`
    const [search, setSearch] = useState(getSessionStorageSearchValue(resolvedKey))

    useEffect(() => {
        setSessionStorageSearchValue(resolvedKey, search)
    }, [search])

    return {
        search, setSearch
    }
}
