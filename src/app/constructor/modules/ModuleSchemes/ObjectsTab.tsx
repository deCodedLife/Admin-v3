import { Formik, FormikProps, Form as FormikForm, useFormikContext } from "formik"
import React, { useEffect, useMemo, useState } from "react"
import { Modal } from "react-bootstrap"
import { useQuery } from "react-query"
import api from "../../../api"
import useSchemes from "../../../api/hooks/useSchemes"
import { ApiObjectSchemeType, ApiResponseType } from "../../../types/api"
import ComponentButton from "../../components/ComponentButton"
import ComponentInput from "../../components/ComponentInput"
import ComponentSelect from "../../components/ComponentSelect"
import { titleFileFormatRemover } from "../helpers"
import ComponentArray from "../../components/ComponentArray"
import { ModuleSchemesButtonsContainer, ModuleSchemesField, ModuleSchemesFieldsRow, ModuleSchemesFieldsSection } from "./ModuleSchemesComponents"
import * as Yup from 'yup';
import { ModuleSchemesObjectFormType, ModuleSchemesObjectPropertyRowType, ModuleSchemesOblectsTabType } from "../../../types/modules"
import ComponentCheckbox from "../../components/ComponentCheckbox"
import MultipleEditModal from "./MultipleEditModal"
import { booleanResponsesList, buttonsSettingsFields, objectPropTypes, objectPropView, smartListFields } from "./helpers/listsItems"
import ComponentObject from "../../components/ComponentObject"
import { getErrorToast } from "../../helpers/toasts"
import setModalIndex from "../../helpers/setModalIndex"

const ObjectPropertyRow: React.FC<ModuleSchemesObjectPropertyRowType> = ({ parentArticle, rowIndex, databaseTables, currentSchemeCommands, isLastProperty }) => {
    const { values, setFieldValue } = useFormikContext<any>()
    const currentStringValues = values.properties[rowIndex]

    const listDonorTableName = currentStringValues.list_donor?.table ?? null

    const { data: listDonorTable } = useQuery(
        ["listDonor", { scheme_name: listDonorTableName }],
        () => api("admin", "get-schemes", { scheme_type: "db", scheme_name: listDonorTableName }), {
        retry: false,
        enabled: Boolean(listDonorTableName),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        select: (data: ApiResponseType<any>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    })

    const connectionTableName = currentStringValues.join?.connection_table ?? null
    const { data: connectionTable } = useQuery(
        ["connectionTable", { scheme_name: connectionTableName }],
        () => api("admin", "get-schemes", { scheme_type: "db", scheme_name: connectionTableName }), {
        retry: false,
        enabled: Boolean(connectionTableName),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        select: (data: ApiResponseType<any>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    })

    const donorTableName = currentStringValues.join?.donor_table ?? null
    const { data: donorTable } = useQuery(
        ["donorTable", { scheme_name: donorTableName }],
        () => api("admin", "get-schemes", { scheme_type: "db", scheme_name: donorTableName }), {
        retry: false,
        enabled: Boolean(donorTableName),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        select: (data: ApiResponseType<any>) => data.data,
        onError: (error: any) => getErrorToast(error.message)
    })



    const [extendedProperties, showExtendedProperties] = useState(false)
    const handleDeletePropertiesRow = () => {
        const propertiesClone = [...values.properties]
        propertiesClone.splice(rowIndex, 1)
        setFieldValue("properties", propertiesClone)
    }
    const handleSwapProperties = (direction: number) => {
        const propertiesClone = [...values.properties]
        propertiesClone.splice(rowIndex, 1)
        propertiesClone.splice(rowIndex + direction, 0, currentStringValues)
        setFieldValue("properties", propertiesClone)
    }
    const handleShowExtendedProperties = () => showExtendedProperties(true)

    const databaseTablesForComponentSelect = useMemo(() => databaseTables.map(table => ({
        title: table,
        value: table
    })), [])
    const currentSchemeCommandsForComponentSelect = useMemo(() => currentSchemeCommands.map(command => ({
        title: command,
        value: command
    })), [currentSchemeCommands])

    const listDonorKeysForComponentSelect = useMemo(() => {
        if (Array.isArray(listDonorTable?.properties)) {
            //Влад попросил вшить параметр id для всех таблиц (в выдаче при запросе с сервера данный параметр не участвует)
            const options = listDonorTable.properties.map((property: any) => property.article).map((article: string) => ({
                title: article,
                value: article
            }))
            options.unshift({
                title: "id",
                value: "id"
            })
            return options
        } else {
            return []
        }
    }, [listDonorTable])

    const connectionTableKeysForComponentSelect = useMemo(() => {
        return connectionTable ? connectionTable.properties?.map((property: any) => property.article).map((article: string) => ({
            title: article,
            value: article
        })) : []
    }, [connectionTable])
    const donorTableKeysForComponentSelect = useMemo(() => {
        return donorTable ? donorTable.properties?.map((property: any) => property.article).map((article: string) => ({
            title: article,
            value: article
        })) : []
    }, [donorTable])

    const customParamsFieldsForComponentArray = useMemo(() => {
        return [
            {
                title: "Название",
                article: "title",
                type: "input",
            },
            {
                title: "Значение",
                article: "value",
                type: "input",
            }
        ]
    }, [])
    const customChecked = values.additionals?.propertiesToEdit?.some((property: string) => property === currentStringValues.article)
    const customCheckboxHandler = () => {
        const currentProretiesToEdit = Array.isArray(values.additionals?.propertiesToEdit) ? [...values.additionals.propertiesToEdit] : []
        if (customChecked) {
            const currentPropertyIndex = currentProretiesToEdit.findIndex((property: string) => property === currentStringValues.article)
            currentProretiesToEdit.splice(currentPropertyIndex, 1)
        } else {
            currentProretiesToEdit.push(currentStringValues.article)
        }
        return setFieldValue("additionals.propertiesToEdit", currentProretiesToEdit)
    }
    return <tr>
        <td>
            <div className="moduleSchemes_propertyControls">
                <ComponentButton
                    className="moduleSchemes_propertySwapButton"
                    type="custom"
                    settings={{ background: "light", icon: "arrow", title: "Вверх" }}
                    customHandler={() => handleSwapProperties(-1)}
                    defaultLabel="icon"
                    disabled={rowIndex === 0} />
                <ComponentCheckbox article="none" className="moduleSchemes_propertyCheckbox" customChecked={customChecked} customHandler={customCheckboxHandler} />
                <ComponentButton
                    className="moduleSchemes_propertySwapButton down"
                    type="custom"
                    settings={{ background: "light", icon: "arrow", title: "Вниз" }}
                    customHandler={() => handleSwapProperties(1)}
                    defaultLabel="icon"
                    disabled={isLastProperty} />
            </div>

        </td>
        <td>
            <ComponentInput article={`${parentArticle}.title`} field_type="string" />
        </td>
        <td>
            <ComponentInput article={`${parentArticle}.article`} field_type="string" />
        </td>
        <td>
            <ComponentSelect article={`${parentArticle}.data_type`} data_type="string" list={objectPropTypes} />
        </td>
        <td>
            <ComponentSelect article={`${parentArticle}.field_type`} data_type="string" list={objectPropView} />
        </td>
        <td>
            <div className="moduleSchemes_actionsCell">
                <ComponentButton
                    type="custom"
                    settings={{ background: "light", icon: "list", title: "Развернуть" }}
                    customHandler={handleShowExtendedProperties}
                    defaultLabel="icon" />
                <Modal
                    size="xl"
                    show={extendedProperties}
                    onHide={() => showExtendedProperties(false)}
                    onEntering={setModalIndex}
                >
                    <Modal.Header>
                        <Modal.Title>
                            Расширенные свойства
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ModuleSchemesFieldsSection>

                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Название" size={3} required>
                                    <ComponentInput article={`${parentArticle}.title`} field_type="string" />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Артикул" size={3} required>
                                    <ComponentInput article={`${parentArticle}.article`} field_type="string" />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Тип" size={3} required>
                                    <ComponentSelect article={`${parentArticle}.data_type`} data_type="string" list={objectPropTypes} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Отображение" size={3} required>
                                    <ComponentSelect article={`${parentArticle}.field_type`} data_type="string" list={objectPropView} />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>

                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Вывод в списке" size={3} required>
                                    <ComponentSelect article={`${parentArticle}.is_default_in_list`} data_type="boolean" list={booleanResponsesList} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Уникальность" size={3} required>
                                    <ComponentSelect article={`${parentArticle}.is_unique`} data_type="boolean" list={booleanResponsesList} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Автозаполнение" size={3} required>
                                    <ComponentSelect article={`${parentArticle}.is_autofill`} data_type="boolean" list={booleanResponsesList} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Выводить в поиске" size={3}>
                                    <ComponentSelect article={`${parentArticle}.is_in_search`} data_type="boolean" list={booleanResponsesList} />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>

                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Выводить в переменных" size={3}>
                                    <ComponentSelect article={`${parentArticle}.is_variable`} data_type="boolean" list={booleanResponsesList} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Вызов хука" size={3}>
                                    <ComponentSelect article={`${parentArticle}.is_hook`} data_type="boolean" list={booleanResponsesList} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Мин. значение" size={3}>
                                    <ComponentInput article={`${parentArticle}.min_value`} field_type="integer" />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Макс. значение" size={3}>
                                    <ComponentInput article={`${parentArticle}.max_value`} field_type="integer" />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>

                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Активность поля" size={3}>
                                    <ComponentSelect article={`${parentArticle}.is_disabled`} data_type="boolean" list={[
                                        { title: "Неактивно", value: true },
                                        { title: "Активно", value: false }
                                    ]} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Видимость поля" size={3}>
                                    <ComponentSelect article={`${parentArticle}.is_visible`} data_type="boolean" list={[
                                        { title: "Видимо", value: true },
                                        { title: "Скрыто", value: false }
                                    ]} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Аннотация к полю" size={3}>
                                    <ComponentInput article={`${parentArticle}.annotation`} field_type="string" />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Размер поля" size={3}>
                                    <ComponentSelect article={`${parentArticle}.size`} data_type="integer" list={[
                                        { title: "1", value: 1 },
                                        { title: "2", value: 2 },
                                        { title: "3", value: 3 },
                                        { title: "4", value: 4 },
                                    ]} />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>

                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Требуемые доступы" size={6}>
                                    <ComponentSelect article={`${parentArticle}.required_permissions`} data_type="string" list={[]} isDisabled />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Требуемые модули" size={6}>
                                    <ComponentSelect article={`${parentArticle}.required_modules`} data_type="string" list={[]} isDisabled />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>

                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Используется в командах" size={6}>
                                    <ComponentSelect
                                        article={`${parentArticle}.use_in_commands`}
                                        data_type="string"
                                        list={currentSchemeCommandsForComponentSelect}
                                        isMulti />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Требуется для команд" size={6}>
                                    <ComponentSelect
                                        article={`${parentArticle}.require_in_commands`}
                                        data_type="string"
                                        list={currentSchemeCommandsForComponentSelect}
                                        isMulti />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>

                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Список значений, которые может принимать св-во" size={12}>
                                    <ComponentArray label="title" article={`${parentArticle}.custom_list`} data_type="object" fields={customParamsFieldsForComponentArray} />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>

                        </ModuleSchemesFieldsSection>

                        <ModuleSchemesFieldsSection title="Источник детальной информации">

                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Таблица" size={3}>
                                    <ComponentSelect article={`${parentArticle}.list_donor.table`} data_type="string" list={databaseTablesForComponentSelect} isClearable />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Свойство" size={3}>
                                    <ComponentSelect article={`${parentArticle}.list_donor.properties_title`} data_type="string" list={listDonorKeysForComponentSelect} isClearable />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>

                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Фильтр записей" size={12}>
                                    <ComponentObject article={`${parentArticle}.list_donor.filters`} keysList={listDonorKeysForComponentSelect} />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>

                        </ModuleSchemesFieldsSection>

                        {
                            currentStringValues.field_type === "smart_list" ?
                                <ModuleSchemesFieldsSection title="Индивидуальные настройки">

                                    <ModuleSchemesFieldsRow>
                                        <ModuleSchemesField title="Таблица 'связка'" size={4}>
                                            <ComponentSelect article={`${parentArticle}.settings.connection_table`} data_type="string" list={databaseTablesForComponentSelect} isClearable />
                                        </ModuleSchemesField>
                                    </ModuleSchemesFieldsRow>

                                    <ModuleSchemesFieldsRow>
                                        <ModuleSchemesField title="Список свойств" size={12}>
                                            <ComponentArray article={`${parentArticle}.settings.properties`} data_type="object" fields={smartListFields} label="title" />
                                        </ModuleSchemesField>
                                    </ModuleSchemesFieldsRow>
                                </ModuleSchemesFieldsSection> : null
                        }

                        {
                            currentStringValues.field_type === "image" ?
                                <ModuleSchemesFieldsSection title="Индивидуальные настройки">

                                    <ModuleSchemesFieldsRow>
                                        <ModuleSchemesField title="Разрешенные форматы" size={12}>
                                            <ComponentArray article={`${parentArticle}.settings.allowed_formats`} data_type="string" />
                                        </ModuleSchemesField>
                                    </ModuleSchemesFieldsRow>
                                </ModuleSchemesFieldsSection> : null
                        }


                        <ModuleSchemesFieldsSection title="Связанные данные">

                            <ModuleSchemesFieldsRow>
                                <ModuleSchemesField title="Таблица 'связка'" size={4}>
                                    <ComponentSelect article={`${parentArticle}.join.connection_table`} data_type="string" list={databaseTablesForComponentSelect} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Таблица 'донор'" size={2}>
                                    <ComponentSelect article={`${parentArticle}.join.donor_table`} data_type="string" list={databaseTablesForComponentSelect} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Св-во для вывода" size={2}>
                                    <ComponentSelect article={`${parentArticle}.join.property_article`} data_type="string" list={donorTableKeysForComponentSelect} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Св-во для связки" size={2}>
                                    <ComponentSelect article={`${parentArticle}.join.insert_property`} data_type="string" list={connectionTableKeysForComponentSelect} />
                                </ModuleSchemesField>
                                <ModuleSchemesField title="Св-во для фильтра" size={2}>
                                    <ComponentSelect article={`${parentArticle}.join.filter_property`} data_type="string" list={connectionTableKeysForComponentSelect} />
                                </ModuleSchemesField>
                            </ModuleSchemesFieldsRow>

                        </ModuleSchemesFieldsSection>
                    </Modal.Body>

                </Modal>
                <ComponentButton
                    type="custom"
                    settings={{ background: "light", icon: "trash", title: "Удалить свойство" }}
                    customHandler={handleDeletePropertiesRow}
                    defaultLabel="icon" />
            </div>
        </td>
    </tr>
}

const ObjectForm: React.FC<ModuleSchemesObjectFormType> = ({ data, selectedScheme, databaseTables, currentSchemeCommands, mutate, deleteScheme = () => { } }) => {
    const [showEditPropertiesModal, setShowEditPropertiesModal] = useState(false)
    const isCreating = !Boolean(selectedScheme)

    const databasesForComponentSelect = useMemo(() => {
        return databaseTables ? databaseTables.map(table => ({
            title: table,
            value: table
        })) : []
    }, [databaseTables])

    const handleSubmit = (values: any) => {
        const valuesClone = { ...values }
        const newSchemeName = valuesClone.article
        delete valuesClone.article
        delete valuesClone.additionals
        mutate({
            scheme_type: "object",
            scheme_name: isCreating ? newSchemeName : selectedScheme,
            scheme_body: JSON.stringify(valuesClone)
        })
    }

    const handleDelete = (values: any) => {
        const valuesClone = { ...values }
        deleteScheme({
            scheme_type: "object",
            scheme_name: selectedScheme,
            scheme_body: JSON.stringify(valuesClone)
        })
    }

    const validationSchema = isCreating ? Yup.object().shape({
        article: Yup.string().required(" "),
        table: Yup.string().required(" "),
        properties: Yup.array().of(Yup.object({
            title: Yup.string().required(" "),
            article: Yup.string().required(" "),
            data_type: Yup.string().required(" "),
            field_type: Yup.string().required(" "),
            is_default_in_list: Yup.boolean().required(" "),
            is_unique: Yup.boolean().required(" "),
            is_autofill: Yup.boolean().required(" ")
        }))
    }) : Yup.object().shape({
        table: Yup.string().required(" "),
        properties: Yup.array().of(Yup.object({
            title: Yup.string().required(" "),
            article: Yup.string().required(" "),
            data_type: Yup.string().required(" "),
            field_type: Yup.string().required(" "),
            is_default_in_list: Yup.boolean().required(" "),
            is_unique: Yup.boolean().required(" "),
            is_autofill: Yup.boolean().required(" ")
        }))
    })

    return <div className="moduleSchemes_form_container">
        <Formik enableReinitialize initialValues={data} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {(props: FormikProps<typeof data & {
                additionals?: {
                    propertiesToEdit?: Array<string>,
                }
            }>) => {
                const { values, setFieldValue, handleSubmit } = props
                const havePropertiesToEdit = Array.isArray(values.additionals?.propertiesToEdit) && values.additionals?.propertiesToEdit.length
                const handleAppendProperty = () => {
                    const propertyInitialValues = {
                        title: "",
                        article: "",
                        data_type: "",
                        field_type: "",
                        is_default_in_list: undefined,
                        is_unique: undefined,
                        is_autofill: undefined
                    }
                    const currentPropertiesClone = Array.isArray(values.properties) ? [...values.properties] : []
                    currentPropertiesClone.push(propertyInitialValues)
                    return setFieldValue("properties", currentPropertiesClone)
                }
                return <FormikForm className="moduleSchemes_form">
                    <ModuleSchemesFieldsSection>
                        <ModuleSchemesFieldsRow>
                            <ModuleSchemesField title="Название" size={3}>
                                <ComponentInput article="title" field_type="string" />
                            </ModuleSchemesField>
                            {
                                isCreating ? <ModuleSchemesField title="Артикул" size={3} required>
                                    <ComponentInput article="article" field_type="string" />
                                </ModuleSchemesField> : null
                            }
                            <ModuleSchemesField title="Таблица" size={3} required>
                                <ComponentSelect article="table" data_type="string" list={databasesForComponentSelect} />
                            </ModuleSchemesField>
                            <ModuleSchemesField title="Корзина" size={3}>
                                <ComponentSelect article="is_trash" data_type="boolean" list={[{ title: "Да", value: true }, { title: "Нет", value: false }]} />
                            </ModuleSchemesField>
                        </ModuleSchemesFieldsRow>

                        <ModuleSchemesFieldsRow>
                            <ModuleSchemesField title="Кнопки действий" size={12}>
                                <ComponentArray
                                    label="settings.title"
                                    article="action_buttons"
                                    data_type="object"
                                    fields={buttonsSettingsFields}
                                    draggable
                                />
                            </ModuleSchemesField>
                        </ModuleSchemesFieldsRow>

                    </ModuleSchemesFieldsSection>

                    <ModuleSchemesFieldsSection title="Свойства" className="propertiesSection">
                        <div className='table-responsive'>
                            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                                <thead>
                                    <tr className='fw-bold text-muted'>
                                        <th></th>
                                        <th className='min-w-150px required'>Название</th>
                                        <th className='min-w-150px required'>Артикул</th>
                                        <th className='min-w-150px required'>Тип</th>
                                        <th className='min-w-150px required'>Отображение</th>
                                        <th className="moduleSchemes_actionsCellHead"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.values.properties.map((property, index, props) => (
                                        <ObjectPropertyRow
                                            parentArticle={`properties[${index}]`}
                                            rowIndex={index}
                                            isLastProperty={props.length - 1 === index}
                                            databaseTables={databaseTables}
                                            currentSchemeCommands={currentSchemeCommands}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ModuleSchemesFieldsSection>

                    <ModuleSchemesButtonsContainer>
                        {
                            havePropertiesToEdit ? <ComponentButton
                                type="custom"
                                settings={{ title: "Редактировать выбранное", background: "dark", icon: "" }}
                                customHandler={() => setShowEditPropertiesModal(true)}
                            /> : null
                        }
                        <ComponentButton
                            type="custom"
                            settings={{ title: "Добавить свойство", background: "dark", icon: "" }}
                            customHandler={handleAppendProperty}
                        />
                        <ComponentButton
                            type="submit"
                            settings={{ title: "Сохранить изменения", background: "dark", icon: "" }}
                            customHandler={handleSubmit}
                        />
                        {
                            !isCreating ? <ComponentButton
                                type="custom"
                                settings={{ title: "Удалить объект", background: "danger", icon: "" }}
                                customHandler={() => handleDelete(values)} /> : null
                        }
                    </ModuleSchemesButtonsContainer>
                    <MultipleEditModal show={showEditPropertiesModal} setShow={setShowEditPropertiesModal} currentSchemeCommands={currentSchemeCommands} />
                </FormikForm>
            }}
        </Formik>
    </div>
}
const ObjectsTab: React.FC<ModuleSchemesOblectsTabType> = ({ schemes, tabs, mutate, deleteScheme }) => {
    const [selectedScheme, setSelectedScheme] = useState<string | undefined>(undefined)
    const { data } = useSchemes<ApiObjectSchemeType>("object", "object", selectedScheme)
    const [createNewScheme, setCreateNewScheme] = useState(false)
    const databaseTables = useMemo(() => tabs.find(tab => tab.type === "db")?.values.map((table: string) => titleFileFormatRemover(table)) ?? null, [tabs])
    const currentSchemeCommands = useMemo(() => {
        const commandTables = tabs.find(tab => tab.type === "command")
        if (selectedScheme && commandTables) {
            const commandsForSelectedScheme = commandTables?.values[selectedScheme] ?? []
            return commandsForSelectedScheme.map((command: string) => titleFileFormatRemover(command))
        } else {
            return []
        }
    }, [selectedScheme])

    useEffect(() => {
        if (selectedScheme) {
            const isIncludeScheme = schemes.some((scheme: string) => scheme.includes(selectedScheme))
            if (!isIncludeScheme) {
                setSelectedScheme(undefined)
            }
        }
    }, [schemes])

    const initialFormValues = useMemo(() => {
        return {
            title: "",
            article: "",
            table: "",
            is_trash: false,
            properties: []
        }
    }, [])
    return <div className="d-flex">
        <div className="moduleSchemes_schemeList_container">
            <Formik enableReinitialize initialValues={{ search: "", schemes, visibleSchemes: schemes }} onSubmit={() => { }}>
                {({ setFieldValue, values }) => <FormikForm>
                    <div className="moduleSchemes_searchContainer">
                        <ComponentInput article="search" field_type="string" customHandler={event => {
                            const inputValue = event.target.value
                            setFieldValue("search", inputValue)
                            if (inputValue.length === 0 || inputValue.length > 3) {
                                const filteredSchemes = values.schemes
                                    .map((scheme: string) => scheme.replace(/\.\w+/, ""))
                                    .filter((scheme: string) => scheme.includes(inputValue))
                                    .map((scheme: string) => scheme + ".json")
                                setFieldValue("visibleSchemes", filteredSchemes)
                            }
                        }} />
                    </div>
                    <ul className="moduleSchemes_schemeList">
                        {values.visibleSchemes.map((scheme: string) => <li key={scheme} onClick={() => setSelectedScheme(titleFileFormatRemover(scheme))}>
                            <div className={`moduleSchemes_schemeList_item${selectedScheme === titleFileFormatRemover(scheme) ? " selected" : ""}`}>
                                {titleFileFormatRemover(scheme)}
                            </div>
                        </li>)}
                    </ul>
                    {selectedScheme ?
                        <ComponentButton type="custom" settings={{ title: "Новый объект", icon: "", background: "dark" }} customHandler={() => setCreateNewScheme(true)} /> : null}
                </FormikForm>}
            </Formik>
        </div>
        <div className="moduleSchemes_content">
            {selectedScheme && data ?
                <ObjectForm
                    data={data}
                    selectedScheme={selectedScheme}
                    databaseTables={databaseTables}
                    currentSchemeCommands={currentSchemeCommands}
                    mutate={mutate}
                    deleteScheme={deleteScheme}
                /> :
                <ComponentButton type="custom" settings={{ title: "Новый объект", icon: "", background: "dark" }} customHandler={() => setCreateNewScheme(true)} />}
        </div>
        <Modal
            size="xl"
            show={createNewScheme}
            onHide={() => setCreateNewScheme(false)}
            onEntering={setModalIndex}
        >
            <Modal.Header>
                <Modal.Title>
                    Создание
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ObjectForm
                    data={initialFormValues}
                    databaseTables={databaseTables}
                    mutate={mutate}
                    currentSchemeCommands={currentSchemeCommands}
                />
            </Modal.Body>
        </Modal>
    </div>
}

export default React.memo(ObjectsTab)