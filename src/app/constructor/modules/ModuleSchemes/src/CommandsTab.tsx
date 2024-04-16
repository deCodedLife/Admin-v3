import { Formik, FormikProps, Form as FormikForm } from "formik"
import React, { useEffect, useMemo, useState } from "react"
import { Modal } from "react-bootstrap"
import useSchemes from "../../../../api/hooks/useSchemes"
import ComponentButton from "../../../components/ComponentButton"
import ComponentInput from "../../../components/ComponentInput"
import ComponentSelect from "../../../components/ComponentSelect"
import { titleFileFormatRemover } from "../../helpers"
import { ModuleSchemesButtonsContainer, ModuleSchemesField, ModuleSchemesFieldsRow, ModuleSchemesFieldsSection } from "./ModuleSchemesComponents"
import * as Yup from 'yup';
import { TApiCommandScheme } from "../../../../types/api"
import { booleanResponsesList, commandTypes } from "../helpers/listsItems"
import setModalIndex from "../../../helpers/setModalIndex"
import {TModuleSchemesCommandForm, TModuleSchemesCommandsTab} from "../_types";

const CommandForm: React.FC<TModuleSchemesCommandForm> = props => {

    const { data, selectedScheme, mutate, deleteScheme = () => { } } = props
    const isCreating = !Boolean(selectedScheme)

    const handleSubmit = (values: any) => {
        const valuesClone = { ...values }
        const newSchemeName = `${valuesClone.object_scheme}/${valuesClone.article}`
        delete valuesClone.article
        mutate({
            scheme_type: "command",
            scheme_name: isCreating ? newSchemeName : selectedScheme,
            scheme_body: JSON.stringify(valuesClone)
        })
    }

    const handleDelete = (values: any) => {
        const valuesClone = { ...values }
        deleteScheme({
            scheme_type: "command",
            scheme_name: selectedScheme,
            scheme_body: JSON.stringify(valuesClone)
        })
    }


    const validationSchema = isCreating ? Yup.object().shape({
        title: Yup.string().required(" "),
        article: Yup.string().required(" "),
        type: Yup.string().required(" ")
    }) : Yup.object().shape({
        title: Yup.string().required(" "),
        type: Yup.string().required(" ")
    })

    return <div className="moduleSchemes_form_container">
        <Formik enableReinitialize initialValues={data} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {(props: FormikProps<typeof data>) => {
                const { values, handleSubmit } = props

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
                            <ModuleSchemesField title="Объект" size={3}>
                                <ComponentInput article="object_scheme" field_type="string" />
                            </ModuleSchemesField>
                        </ModuleSchemesFieldsRow>

                        <ModuleSchemesFieldsRow>
                            <ModuleSchemesField title="Тип" size={3} required>
                                <ComponentSelect article="type" data_type="string" list={commandTypes} />
                            </ModuleSchemesField>
                            {
                                values.type === "get" ? <ModuleSchemesField title="Вывод без ограничений" size={3}>
                                    <ComponentSelect article="no_limit" data_type="boolean" list={booleanResponsesList} />
                                </ModuleSchemesField> : null
                            }
                        </ModuleSchemesFieldsRow>

                        <ModuleSchemesFieldsRow>
                            <ModuleSchemesField title="Требуемые доступы" size={6}>
                                <ComponentSelect article="required_permissions" data_type="string" list={[]} isMulti isDisabled />
                            </ModuleSchemesField>
                            <ModuleSchemesField title="Требуемые модули" size={6}>
                                <ComponentSelect article="required_modules" data_type="string" list={[]} isMulti isDisabled />
                            </ModuleSchemesField>
                        </ModuleSchemesFieldsRow>

                    </ModuleSchemesFieldsSection>

                    <ModuleSchemesButtonsContainer>
                        <ComponentButton
                            type="submit"
                            settings={{ title: "Сохранить изменения", background: "dark", icon: "" }}
                            customHandler={handleSubmit}
                        />
                        {
                            !isCreating ? <ComponentButton
                                type="custom"
                                settings={{ title: "Удалить команду", background: "danger", icon: "" }}
                                customHandler={() => handleDelete(values)} /> : null
                        }
                    </ModuleSchemesButtonsContainer>

                </FormikForm>
            }}
        </Formik>
    </div>
}
const CommandsTab: React.FC<TModuleSchemesCommandsTab> = ({ schemes, mutate, deleteScheme }) => {
    const [selectedScheme, setSelectedScheme] = useState<string | undefined>(undefined)
    const { data } = useSchemes<TApiCommandScheme>("command", "command", selectedScheme)
    const [createNewScheme, setCreateNewScheme] = useState(false)
    const schemesBySections = useMemo(() => {
        return Object.entries<Array<string>>(schemes)
    }, [schemes])

    useEffect(() => {
        if (selectedScheme) {
            const [section, schemeName] = selectedScheme.split("/")
            const isIncludeScheme = schemes[section]?.some((scheme: string) => scheme.includes(schemeName))
            if (!isIncludeScheme) {
                setSelectedScheme(undefined)
            }
        }
    }, [schemes])

    const initialFormValues = useMemo(() => {
        return {
            title: "",
            article: "",
            type: "",
            object_scheme: "",
            modules: [],
            permissions: []
        }
    }, [])

    return <div className="d-flex">
        <div className="moduleSchemes_schemeList_container">
            <Formik enableReinitialize initialValues={{ search: "", schemes: schemesBySections, visibleSchemes: schemesBySections }} onSubmit={() => { }}>
                {({ setFieldValue, values }) => <FormikForm>
                    <div className="moduleSchemes_searchContainer">
                        <ComponentInput article="search" field_type="string" customHandler={event => {
                            const inputValue = event.target.value
                            setFieldValue("search", inputValue)
                            if (inputValue.length === 0 || inputValue.length >= 3) {

                                /*
                                --- фильтрация по командам 
                                */
                                /*  const filteredSchemes = values.schemes
                                     .map(section => {
                                         const filteredCommands = section[1]
                                             .map(command => command.replace(/\.\w+/, ""))
                                             .filter(command => command.includes(inputValue))
                                             .map(command => command + ".json")
                                         return [section[0], filteredCommands]
                                     })
                                     .filter(section => section[1].length) */


                                /*
                                --- фильтрация по разделам 
                                */
                                const filteredSchemes = values.schemes.filter(section => section[0].includes(inputValue))

                                setFieldValue("visibleSchemes", filteredSchemes)
                            }
                        }} />
                    </div>
                    <ul className="moduleSchemes_schemeList">
                        {values.visibleSchemes.map(([sectionTitle, sectionValues]: Array<any>) => <>
                            <li><h4>{sectionTitle}</h4></li>
                            {sectionValues.map((scheme: string) => <li key={scheme} onClick={() => setSelectedScheme(`${sectionTitle}/${titleFileFormatRemover(scheme)}`)}>
                                <div className={`moduleSchemes_schemeList_item${selectedScheme === `${sectionTitle}/${titleFileFormatRemover(scheme)}` ? " selected" : ""}`}>
                                    {titleFileFormatRemover(scheme)}
                                </div>
                            </li>)}
                        </>)}
                    </ul>
                    {selectedScheme ?
                        <ComponentButton type="custom" settings={{ title: "Новая команда", icon: "", background: "dark" }} customHandler={() => setCreateNewScheme(true)} /> : null}
                </FormikForm>}
            </Formik>
        </div>
        <div className="moduleSchemes_content">
            {selectedScheme && data ? <CommandForm data={data} selectedScheme={selectedScheme} mutate={mutate} deleteScheme={deleteScheme} /> :
                <ComponentButton type="custom" settings={{ title: "Новая команда", icon: "", background: "dark" }} customHandler={() => setCreateNewScheme(true)} />}
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
                <CommandForm data={initialFormValues} mutate={mutate} />
            </Modal.Body>
        </Modal>
    </div>
}

export default React.memo(CommandsTab)