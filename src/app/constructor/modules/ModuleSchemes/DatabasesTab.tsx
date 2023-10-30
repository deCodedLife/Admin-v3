import { Formik, FormikProps, Form as FormikForm, useFormikContext } from "formik"
import React, { useEffect, useMemo, useState } from "react"
import { Modal } from "react-bootstrap"
import useSchemes from "../../../api/hooks/useSchemes"
import ComponentButton from "../../components/ComponentButton"
import ComponentCheckbox from "../../components/ComponentCheckbox"
import ComponentInput from "../../components/ComponentInput"
import ComponentSelect from "../../components/ComponentSelect"
import { titleFileFormatRemover } from "../helpers"
import * as Yup from 'yup';
import { ModuleSchemesButtonsContainer, ModuleSchemesField, ModuleSchemesFieldsRow, ModuleSchemesFieldsSection } from "./ModuleSchemesComponents"
import { ApiDatabaseSchemeType } from "../../../types/api"
import { ModuleSchemesDatabaseFormType, ModuleSchemesDatabasePropertyRowType, ModuleSchemesDatabasesTabType } from "../../../types/modules"
import ComponentArray from "../../components/ComponentArray"
import { databasePropTypes } from "./helpers/listsItems"
import setModalIndex from "../../helpers/setModalIndex"

const DatabasePropertyRow: React.FC<ModuleSchemesDatabasePropertyRowType> = ({ parentArticle, rowIndex }) => {
    const { values, setFieldValue } = useFormikContext<any>()
    const handleDeletePropertiesRow = () => {
        const propertyClone = [...values.properties]
        propertyClone.splice(rowIndex, 1)
        setFieldValue("properties", propertyClone)
    }
    return <tr>
        <td>
            <ComponentInput article={`${parentArticle}.title`} field_type="string" />
        </td>
        <td>
            <ComponentInput article={`${parentArticle}.article`} field_type="string" />
        </td>
        <td>
            <ComponentSelect article={`${parentArticle}.type`} data_type="string" list={databasePropTypes} />
        </td>
        <td>
            <ComponentInput article={`${parentArticle}.default`} field_type="string" />
        </td>
        <td>
            <ComponentCheckbox label="Обязательное" article={`${parentArticle}.is_required`} customChecked={values.properties[rowIndex].is_required === "Y"} customHandler={() => {
                const currentValue = values.properties[rowIndex].is_required
                setFieldValue(`${parentArticle}.is_required`, currentValue === "Y" ? "N" : "Y")
            }} />
        </td>
        <td>
            <ComponentButton
                type="custom"
                settings={{ background: "light", icon: "trash", title: "Удалить свойство" }}
                customHandler={handleDeletePropertiesRow}
                defaultLabel="icon" />
        </td>
    </tr>
}

const DatabaseForm: React.FC<ModuleSchemesDatabaseFormType> = ({ data, selectedScheme, mutate, deleteScheme = () => { } }) => {

    const isCreating = !Boolean(selectedScheme)

    const handleSubmit = (values: any) => {
        const valuesClone = { ...values }
        const newSchemeName = valuesClone.article
        delete valuesClone.article
        mutate({
            scheme_type: "db",
            scheme_name: isCreating ? newSchemeName : selectedScheme,
            scheme_body: JSON.stringify(valuesClone)
        })
    }

    const handleDelete = (values: any) => {
        const valuesClone = { ...values }
        deleteScheme({
            scheme_type: "db",
            scheme_name: selectedScheme,
            scheme_body: JSON.stringify(valuesClone)
        })
    }

    const validationSchema = isCreating ? Yup.object().shape({
        title: Yup.string().required(" "),
        article: Yup.string().required(" "),
        properties: Yup.array().of(Yup.object({
            title: Yup.string().required(" "),
            article: Yup.string().required(" "),
            type: Yup.string().required(" ")
        }))
    }) : Yup.object().shape({
        title: Yup.string().required(" "),
        properties: Yup.array().of(Yup.object({
            title: Yup.string().required(" "),
            article: Yup.string().required(" "),
            type: Yup.string().required(" ")
        }))
    })
    return <div className="moduleSchemes_form_container">
        <Formik enableReinitialize initialValues={data} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {(props: FormikProps<typeof data>) => {
                const { values, setFieldValue, handleSubmit } = props

                const handleAppendProperty = () => {
                    const propertyInitialValues = {
                        title: "",
                        article: "",
                        type: "",
                        default: null,
                        is_required: "N" as "N"
                    }
                    const currentPropertiesClone = [...values.properties]
                    currentPropertiesClone.push(propertyInitialValues)
                    return setFieldValue("properties", currentPropertiesClone)
                }

                const getFieldsForSystemRows = () => {
                    const sourseFromProperties = Array.isArray(values.properties) ? values.properties.map(({ title, article }) => ({ title, article })) : []
                    const currentFields = sourseFromProperties.map(property => ({
                        title: property.title,
                        article: property.article,
                        type: "input"
                    }))
                    currentFields.unshift({
                        title: "Идентификатор",
                        article: "id",
                        type: "input"
                    })
                    return currentFields

                }

                return <FormikForm className="moduleSchemes_form">
                    <ModuleSchemesFieldsSection>
                        <ModuleSchemesFieldsRow>
                            <ModuleSchemesField title="Название" size={3} required>
                                <ComponentInput article="title" field_type="string" />
                            </ModuleSchemesField>
                            {
                                isCreating ? <ModuleSchemesField title="Артикул" size={3} required>
                                    <ComponentInput article="article" field_type="string" />
                                </ModuleSchemesField> : null
                            }
                            <ModuleSchemesField title="Ключ" size={3}>
                                <ComponentInput article="rows_key" field_type="string" />
                            </ModuleSchemesField>

                        </ModuleSchemesFieldsRow>
                        <ModuleSchemesFieldsRow>
                            <ModuleSchemesField title="Обязательные записи" size={12}>
                                <ComponentArray
                                    label="title"
                                    article="rows"
                                    data_type="object"
                                    fields={getFieldsForSystemRows()}
                                />
                            </ModuleSchemesField>
                        </ModuleSchemesFieldsRow>
                    </ModuleSchemesFieldsSection>

                    <ModuleSchemesFieldsSection title="Свойства" className="propertiesSection">
                        <div className='table-responsive'>
                            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
                                <thead>
                                    <tr className='fw-bold text-muted'>
                                        <th className='min-w-150px required'>Название</th>
                                        <th className='min-w-150px required'>Артикул</th>
                                        <th className='min-w-150px required'>Тип данных</th>
                                        <th className='min-w-150px'>Значение по умолчанию</th>
                                        <th className='min-w-150px'>Обязательность</th>
                                        <th className="moduleSchemes_actionCellHead"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.values.properties.map((property, index) => (
                                        <DatabasePropertyRow parentArticle={`properties[${index}]`} rowIndex={index} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ModuleSchemesFieldsSection>

                    <ModuleSchemesButtonsContainer>
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
                                settings={{ title: "Удалить таблицу", background: "danger", icon: "" }}
                                customHandler={() => handleDelete(values)} /> : null
                        }
                    </ModuleSchemesButtonsContainer>
                </FormikForm>
            }}
        </Formik>
    </div>
}
const DatabasesTab: React.FC<ModuleSchemesDatabasesTabType> = ({ schemes, mutate, deleteScheme }) => {
    const [selectedScheme, setSelectedScheme] = useState<string | undefined>(undefined)
    const { data } = useSchemes<ApiDatabaseSchemeType>("db", "db", selectedScheme)
    const [createNewScheme, setCreateNewScheme] = useState(false)
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
                        <ComponentButton type="custom" settings={{ title: "Новая таблица", icon: "", background: "dark" }} customHandler={() => setCreateNewScheme(true)} /> : null}
                </FormikForm>}
            </Formik>
        </div>
        <div className="moduleSchemes_content">
            {selectedScheme && data ? <DatabaseForm data={data} selectedScheme={selectedScheme} mutate={mutate} deleteScheme={deleteScheme} /> :
                <ComponentButton type="custom" settings={{ title: "Новая таблица", icon: "", background: "dark" }} customHandler={() => setCreateNewScheme(true)} />}
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
                <DatabaseForm data={initialFormValues} mutate={mutate} />
            </Modal.Body>
        </Modal>
    </div>
}

export default React.memo(DatabasesTab)