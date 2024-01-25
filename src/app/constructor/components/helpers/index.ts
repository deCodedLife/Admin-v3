import moment from "moment"
import api from "../../../api"
import { set, unset } from "lodash"
import { getMaskedString } from "../../modules/helpers"
import { ApiSetupType } from "../../../types/api"
import { useEffect, useState } from "react"

//функция вызова хука у поля после изменения значений
export const hookAfterChange = async (
    field_article: string, field_value: any, values: any,
    setFieldValue: (article: string, value: any) => void, requestObject: string
) => {
    //технические данные в форме
    const fieldsVisibilityArticle = "fieldsVisibility"
    const fieldsDescriptionsArticle = "fieldsDescriptions"
    const fieldsDisabledArticle = "fieldsDisabled"
    //

    //использую lodash по причине наличия вложенности во многих артикулах
    const valuesWithCurrentFieldValue = set({ ...values }, field_article, field_value)
    unset(valuesWithCurrentFieldValue, fieldsVisibilityArticle)
    unset(valuesWithCurrentFieldValue, fieldsDescriptionsArticle)
    unset(valuesWithCurrentFieldValue, fieldsDisabledArticle)

    const { data: actualValues } = await api(requestObject, "hook", valuesWithCurrentFieldValue)
    if (actualValues && !Array.isArray(actualValues)) {
        for (let key in actualValues) {

            const fieldSettings = actualValues[key]

            if (key === "modal_info") {
                setFieldValue(key, fieldSettings)
                continue

            }
            if (fieldSettings.hasOwnProperty("value") && key !== field_article) {
                setFieldValue(key, fieldSettings.value)
            }
            if (fieldSettings.hasOwnProperty("is_visible")) {
                setFieldValue(`${fieldsVisibilityArticle}.${key}`, fieldSettings.is_visible)
            }
            if (fieldSettings.hasOwnProperty("is_disabled")) {
                setFieldValue(`${fieldsDisabledArticle}.${key}`, fieldSettings.is_disabled)
            }
            if (fieldSettings.hasOwnProperty("description")) {
                setFieldValue(`${fieldsDescriptionsArticle}.${key}`, fieldSettings.description)
            }
        }

        /*
        --- модальное окно уведомлений 
        */
        if ("modal_info" in actualValues) {
            setFieldValue("modal_info", actualValues["modal_info"])
        } else {
            setFieldValue("modal_info", null)
        }
    }
}
export const useHook = (article: string, values: any, setFieldValue: (article: string, value: any) => void, hook?: string) => {
    const [valueForHook, setValueForHook] = useState<any>(null)

    useEffect(() => {
        const isValidValue = valueForHook !== null && valueForHook !== undefined
        if (isValidValue && hook) {
            hookAfterChange(article, valueForHook, values, setFieldValue, hook)
        }
    }, [valueForHook])
    
    return setValueForHook
}
//функции для автоподстановки переменных в документ
const getFormattedValue = (type: string, value: any, context: ApiSetupType) => {
    if (!value) {
        return "-"
    } else {
        switch (type) {
            case "date":
                return moment(value).format("DD.MM.YYYY г.")
            case "time":
                return moment(value, "HH:mm").format("HH:mm")
            case "datetime":
                /*
                --- может быть формат типа гггг-мм-дд чч:мм - чч:мм 
                */
                const splitedTime = value.replace(" - ", "-").split(" ")[1].split("-")
                const isTimeSpectr = splitedTime.length === 2
                return isTimeSpectr ? `${moment(value.split(" ")[0]).format("DD.MM.YYYY")} ${splitedTime[0]} - ${splitedTime[1]}` : moment(value).format("DD.MM.YYYY HH:mm")
            case "price":
            case "phone":
                return getMaskedString(value, type, context)
            case "list":
                return Array.isArray(value) ?
                    value.reduce((acc, value, index) => acc + `${value?.title ?? value}${index < value.length - 1 ? ", " : ""}`, "") :
                    value?.title ?? value
            default:
                return value
        }
    }
}


export const autocompleteDocument = async (
    document: { object?: string, structure: Array<{ block_type: string, settings: { document_body: string } }> },
    row_id: string | number,
    scheme_name: string,
    currentUser: any,
    applicationContext: ApiSetupType
) => {
    const variables: any = {
        globalVariables: {
            id: currentUser.id,
            first_name: currentUser.first_name,
            last_name: currentUser.last_name,
            patronymic: currentUser.patronymic,
            fio: `${currentUser.last_name ?? "-"} ${currentUser.first_name?.[0] ?? "-"}. ${currentUser.patronymic?.[0] ?? "-"}.`,
            today: moment().format("YYYY-MM-DD HH:mm:ss")
        }
    }
    //если привязан объект и передан id строки объекта - сделать запрос на получение значений объекта
    if (scheme_name && row_id) {
        const { data: variableValues } = await api("admin", "get-variables-value", { scheme_name, row_id })
        variables[scheme_name] = variableValues
    }
    //сложение структуры документа в одну строку
    let documentContent = document.structure.filter(block => !block.block_type || block.block_type === "text").reduce((acc, block) => acc + block.settings.document_body + "<br>", "")

    //проверка на наличие динамических строк таблицы, заполняется перед переменными, чтобы нижний парсер не задел переменные таблицы
    const dynamicTableRows = documentContent.match(/<tr.+data-dynamic="true">((?!<\/tr>)[\s\S])*<\/tr>/gi)
    if (Array.isArray(dynamicTableRows)) {
        const resolvedTableRows = dynamicTableRows.map(row => {
            //находим переменные в строке
            const variablesFromRow = row.match(/{[^}]+}/gi)
            //находим ключ, значения которого будут перечисляться в таблице. Ключ находится в атрибуте data-type (data-type="some prop")
            const sourceKey = row.match(/data-type="\w+"/gi)?.[0].split('="')[1].slice(0, -1) ?? ""
            const sourceKeyValue = variables[scheme_name]?.[sourceKey]
            //проверяем, найден ли источник данных, а так же то, является ли он массивом или объектом
            const resolvedValue = sourceKeyValue && Array.isArray(variablesFromRow) ?
                Array.isArray(sourceKeyValue) ? sourceKeyValue.reduce((acc, item: any, index) => {
                    //определяем каждую переменную и заменяем в строке. Кол-во строк определяется длиной источника данных (массив)
                    const resolvedRow = variablesFromRow.reduce((acc, variable: string) => {
                        if (variable === "{index}") {
                            return acc.replace(variable, `${index + 1}`)
                        }
                        const [path, parentType, article, type] = variable.replace(/{|}/gi, "").split(":")
                        const currentSourceKey = path.split("/")[1]
                        if (currentSourceKey === sourceKey) {
                            const resolvedValue = getFormattedValue(type, item[article], applicationContext)
                            return acc.replace(variable, resolvedValue)
                        } else {
                            const currentValueSource = variables[scheme_name][currentSourceKey]
                            const resolvedValue = Array.isArray(currentValueSource) ? currentValueSource.map(item => getFormattedValue(type, item?.[article], applicationContext))
                                .join("<br/>") : getFormattedValue(type, currentValueSource?.[article], applicationContext)
                            return acc.replace(variable, resolvedValue)
                        }
                    }, row)
                    return acc + resolvedRow
                }, "") :
                    variablesFromRow.reduce((acc, variable: string) => {
                        if (variable === "{index}") {
                            return acc.replace(variable, "1")
                        }
                        //определяем каждую переменную и заменяем в строке.
                        const [path, parentType, article, type] = variable.replace(/{|}/gi, "").split(":")
                        const currentSourceKey = path.split("/")[1]
                        if (currentSourceKey === sourceKey) {
                            const resolvedValue = getFormattedValue(type, sourceKeyValue[article], applicationContext)
                            return acc.replace(variable, resolvedValue)
                        } else {
                            const currentValueSource = variables[scheme_name][currentSourceKey]
                            const resolvedValue = Array.isArray(currentValueSource) ? currentValueSource.map(item => getFormattedValue(type, item[article], applicationContext))
                                .join("<br/>") : getFormattedValue(type, currentValueSource[article], applicationContext)
                            return acc.replace(variable, resolvedValue)
                        }
                    }, row) :
                row
            return {
                source: row,
                value: resolvedValue
            }
        })
        documentContent = resolvedTableRows.reduce((acc, row) => acc.replace(row.source, row.value), documentContent)
    }

    //поиск переменных в строке
    const variablesFromDocument = documentContent.match(/{[^}]+}/gi)
    //нахождение значений переменных из доступных в объекте variables данных и подстановка
    if (Array.isArray(variablesFromDocument)) {
        const resolved = variablesFromDocument.map(variable => {
            /* данные по внутренней переменной могут отсутствовать */
            const [variablePath, variableType, innerVariablePath, innerVariableType] = variable.replace(/{|}/gi, "").split(":")
            /*
            --- костылище 
            */
            const value = variablePath.split("/").reduce((acc, path, index) => {
                const value = acc?.[path]
                /* если объект не найдет в переменных (только для 0 индекса - который является ключом основного объекта), использовать первый попавшийся объект */
                return (!value && index === 0) ? Object.entries<{ [key: string]: any }>(acc).filter(([key, values]) => key !== "globalVariables")[0][1] : value
            }, variables) /* ??
            /* при наличии внутреннего пути нужно проверить, массив ли это, т.к. объекты тоже передаются с типом list */
            const resolvedValue = innerVariablePath && value ? Array.isArray(value) ?
                value.map((item: any) => getFormattedValue(innerVariableType, item[innerVariablePath], applicationContext))
                    .reduce((acc: string, step: any, index: number) => acc + step + ((index === value.length - 1) ? "" : ", "), "") :
                getFormattedValue(innerVariableType, value[innerVariablePath], applicationContext) :
                getFormattedValue(variableType, value, applicationContext)
            return {
                source: variable,
                value: resolvedValue
            }
        })
        const resolvedDocument = resolved.reduce((acc, variable) => acc.replace(variable.source, variable.value ?? variable.source), documentContent)
        return resolvedDocument
    } else {
        return documentContent
    }
}
