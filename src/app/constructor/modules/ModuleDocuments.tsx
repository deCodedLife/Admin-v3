import { Formik, Form as FormikForm } from "formik"
import React, { useEffect, useMemo, useState } from "react"
import { Form, Col, Modal, Dropdown } from "react-bootstrap"
import { ModuleDocumentsType } from "../../types/modules"
import ComponentSelect from "../components/ComponentSelect"
import ComponentButton from "../components/ComponentButton"
import ComponentDashboard from "../components/ComponentDashboard"
import ComponentInput from "../components/ComponentInput"
import useDocument from "../../api/hooks/useDocument"
import ComponentTextEditor from "../components/ComponentTextEditor"
import * as Yup from 'yup';
//@ts-ignore
import { default as printer } from 'print-html-element';
import useMutate from "../../api/hooks/useMutate"
import { useNavigate } from "react-router-dom"
import useRequest from "../../api/hooks/useRequest"
import { Component } from "./ModuleForm/ModuleForm"
import { IntlShape, useIntl } from "react-intl"
import ComponentTooltip from "../components/ComponentTooltip"
import setModalIndex from "../helpers/setModalIndex"
import api from "../../api"
import { getErrorToast } from "../helpers/toasts"
import { useIsSubpage } from "./helpers"
import { useHandleSubmitContext } from "../../page/DynamicPage"
import { isEqual } from "lodash"


type TModuleDocumentsButtons = {
    intl: IntlShape,
    isSubpage: boolean,
    document_body: string,
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void,
    handlePrintContent: (content: string) => void
}

const ModuleDocumentsButtons = React.memo<TModuleDocumentsButtons>(props => {
    const { intl, isSubpage, document_body, handleSubmit, handlePrintContent } = props
    const setHandleSubmit = useHandleSubmitContext()
    useEffect(() => {
        if (isSubpage) {
            setHandleSubmit({ type: "submit", settings: { title: intl.formatMessage({ id: "BUTTON.SAVE" }), background: "dark", icon: "" }, customHandler: handleSubmit })
            return () => setHandleSubmit(prev => isEqual(prev?.customHandler, handleSubmit) ? null : prev)
        }
    }, [])
    return <div className="componentButton_container inverse">
        <ComponentButton
            type="custom"
            settings={{ title: intl.formatMessage({ id: "BUTTON.PRINT" }), icon: "", background: "dark" }}
            customHandler={() => handlePrintContent(document_body)}
        />
        {
            !isSubpage ? <ComponentButton
                type="submit"
                settings={{ title: intl.formatMessage({ id: "BUTTON.SAVE" }), background: "dark", icon: "" }}
                customHandler={handleSubmit}
            /> : null
        }
    </div>
})

const ModuleDocuments: React.FC<ModuleDocumentsType> = (props) => {
    const intl = useIntl()
    const { settings } = props
    const { object, command, fields_list } = settings
    const navigate = useNavigate()
    const { data } = useDocument()
    const { data: serverVariables, isLoading: isVariablesLoading } = useRequest('admin', "get-variables", {})
    const { mutate, isSuccess } = useMutate(object, command)
    const [editBlock, setEditBlock] = useState<{ type: "header" | "footer", content: string } | null>(null)

    const isSubpage = useIsSubpage()

    /* const handlePrintContent = (documentContent: { header?: string, body: string, footer?: string }) => {
        const { header, footer, body } = documentContent
        const template = header || footer ?
            `${header ? `<div class="print-page-header">${header}</div>` : ""}
            <div class="print-page-content">{{printBody}}</div>
            ${footer ? `<div class="print-page-footer">${footer}</div>` : ""}`
            : null
        const content = template ? `<table>
            <thead><tr><td>
              <div class="print-page-space">${header ?? ""}</div>
            </td></tr></thead>
            <tbody><tr><td>
              <div class="content">${body}</div>
            </td></tr></tbody>
            <tfoot><tr><td>
              <div class="print-page-space">${footer ?? ""}</div>
            </td></tr></tfoot>
          </table>` : body
        return printer.printHtml(content, template ? { templateString: template } : {})
    } */

    const handlePrintContent = async (content: string) => {
        const response = await api("documents", "print", { body: content })
        if (response.data) {
            printer.printHtml(response.data)
        } else {
            getErrorToast("Что-то пошло не так")
        }
    }

    const handleSubmitForm = (values: { document_header: string, document_body: string, document_footer: string }) => {
        const structureValue: Array<{ block_position: number | null, block_type: string, settings: { document_body: string } }> = []
        structureValue.push({ block_position: null, block_type: "text", settings: { document_body: values.document_body } })
        if (values.document_header) {
            structureValue.push({ block_position: null, block_type: "header", settings: { document_body: values.document_header } })
        }
        if (values.document_footer) {
            structureValue.push({ block_position: null, block_type: "footer", settings: { document_body: values.document_footer } })
        }
        const valuesClone: any = { ...values }
        delete valuesClone["document_body"]
        delete valuesClone["document_header"]
        delete valuesClone["document_footer"]
        valuesClone["structure"] = structureValue
        mutate(valuesClone)
    }

    const formValidationSchema = Yup.object().shape({
        title: Yup.string().required(" "),
        document_body: Yup.string().required(" ")
    })


    useEffect(() => {
        if (isSuccess && isSubpage) {
            navigate(-1)
        }
    }, [isSuccess])

    const objectsForBindList = useMemo(() => {
        return serverVariables ? Object.entries<{ title: string }>(serverVariables).map(([object, { title }]) => ({ title, value: object })) : []
    }, [serverVariables])

    const variables = useMemo(() => {
        let variables = [] as Array<any>
        let tableVariables = [] as Array<any>
        const globalVariables = {
            title: "Глобальные переменные",
            variables: [
                { variable: "globalVariables/today:date", title: "Текущий день. Дата" },
                { variable: "globalVariables/today:time", title: "Текущий день. Время" },
                { variable: "globalVariables/today:datetime", title: "Текущий день. Дата и время" },
                { variable: "globalVariables/first_name:string", title: "Текущий пользователь. Имя" },
                { variable: "globalVariables/last_name:string", title: "Текущий пользователь. Фамилия" },
                { variable: "globalVariables/patronymic:string", title: "Текущий пользователь. Отчество" },
                { variable: "globalVariables/fio:string", title: "Текущий пользователь. ФИО" },
                { variable: "globalVariables/id:string", title: "Текущий пользователь. Идентификатор" },
            ]
        }
        variables = variables.concat(globalVariables)
        if (serverVariables) {
            const serverVariablesAsArray = Object.entries<any>(serverVariables)
            const [variablesObject, bindedVariables] = serverVariablesAsArray[serverVariablesAsArray.length - 1]
            if (bindedVariables && bindedVariables.variables) {
                const restructuredVariables = Object.entries<{ title: string, field_type: string, inner_variables?: any }>(bindedVariables.variables)
                /* Сначала формируем раздел с переменными без вложенности (общий раздел) */
                const resolvedBindedVariables = {
                    title: `${bindedVariables.title} ${intl.formatMessage({ id: "DOCUMENTS.COMMON_VARIABLES_POSTFIX" })}`,
                    variables: restructuredVariables.filter(([key, variableProps]) => !variableProps.inner_variables).map(([key, variableProps]) => ({
                        title: variableProps.title,
                        variable: `${variablesObject}/${key}:${variableProps.field_type}`,
                    }))
                }
                /* переменные с вложенностью (внутренними переменными) делаем отдельным разделом каждую */
                const variablesWithInnerVariables = restructuredVariables.filter(([key, variableProps]) => variableProps.inner_variables).map(([key, variableProps]) => ({
                    title: variableProps.title,
                    variables: Object.entries<{ title: string, field_type: string }>(variableProps.inner_variables).map(([variableKey, innerVariableProps]) => ({
                        title: innerVariableProps.title,
                        variable: `${variablesObject}/${key}:${variableProps.field_type}:${variableKey}:${innerVariableProps.field_type}`
                    }))
                }))
                /* связываем все разделы в один массив (разделы с глобальными переменными, общий, с вложенными переменными) */
                variables = variables.concat(resolvedBindedVariables, variablesWithInnerVariables)
                /* формируем переменные для динамической таблицы */
                tableVariables = restructuredVariables.filter(([key, variableProps]) => variableProps.field_type === "list" && variableProps.inner_variables)
                    .map(([key, variableProps]) => ({
                        title: variableProps.title,
                        variables: Object.entries<{ title: string, field_type: string }>(variableProps.inner_variables).map(([variableKey, innerVariableProps]) => ({
                            title: innerVariableProps.title,
                            variable: `${variablesObject}/${key}:${variableProps.field_type}:${variableKey}:${innerVariableProps.field_type}`
                        }))
                    }))
            }
        }
        return {
            variables,
            tableVariables
        }
    }, [serverVariables, data])

    const initialValues = useMemo(() => {
        if (data) {
            const documentClone: any = { ...data }
            const documentStructure = documentClone.structure as Array<any> ?? []
            delete documentClone["structure"]
            documentClone["document_header"] = documentStructure.filter((document: { block_type: string }) => document.block_type === "header")
                .reduce((acc, currentDocument: { settings: { document_body: string } }, index, array) => {
                    return acc + currentDocument.settings.document_body + ((array.length - 1 === index) ? "" : "<br>")
                }, "")
            documentClone["document_footer"] = documentStructure.filter((document: { block_type: string }) => document.block_type === "footer")
                .reduce((acc, currentDocument: { settings: { document_body: string } }, index, array) => {
                    return acc + currentDocument.settings.document_body + ((array.length - 1 === index) ? "" : "<br>")
                }, "")
            documentClone["document_body"] = documentStructure.filter((document: { block_type: string }) => document.block_type === "text")
                .reduce((acc, currentDocument: { settings: { document_body: string } }, index, array) => {
                    return acc + currentDocument.settings.document_body + ((array.length - 1 === index) ? "" : "<br>")
                }, "")
            if (Array.isArray(fields_list)) {
                fields_list.forEach(field => {
                    if (field.field_type === "list") {
                        //@ts-ignore
                        const initialListValue = documentClone[field.article]
                        //@ts-ignore
                        documentClone[field.article] = initialListValue ? Array.isArray(initialListValue) ?
                            initialListValue.map((value: { title: string, value: any }) => value.value) : initialListValue.value : null
                    } else {
                        if (!documentClone.hasOwnProperty(field.article)) {
                            documentClone[field.article] = field.value
                        }
                    }
                })
            }
            return documentClone
        } else {
            const initials: {[key: string]: any} = {
                title: "",
                type_id: 2, //убрать, пока обязательный параметр для сервера
                document_header: "",
                document_footer: "",
                document_body: ""
            }
            if (Array.isArray(fields_list)) {
                fields_list.forEach(field => {
                    if (!initials.hasOwnProperty(field.article)) {
                        initials[field.article] = field.value
                    }
                })
            }
            return initials
        }
    }, [data])
    return <div className="moduleDocuments">
        <Formik enableReinitialize initialValues={initialValues} validationSchema={formValidationSchema} onSubmit={handleSubmitForm}>
            {
                ({ values, setFieldValue, handleSubmit }) => {
                    const haveHeader = Boolean(values.document_header)
                    const haveFooter = Boolean(values.document_footer)
                    const handleSubmitBlockForm = (values: { content: string }) => {
                        if (editBlock) {
                            setFieldValue(editBlock.type === "header" ? "document_header" : "document_footer", values.content)
                            setEditBlock(null)
                        }
                    }
                    return <FormikForm className="moduleDocuments_form">
                        <ModuleDocumentsButtons
                            intl={intl}
                            isSubpage={isSubpage}
                            document_body={values.document_body}
                            handlePrintContent={handlePrintContent}
                            handleSubmit={handleSubmit}
                        />
                        {/* временно отключить возможность установки колонтитулов */}
                        {/* <ComponentDashboard inverse>
                            <Dropdown>
                                <Dropdown.Toggle className="moduleDocuments_dropdown">
                                    {intl.formatMessage({ id: "DROPDOWN.TITLE" })}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#" onClick={(event) => {
                                        event.preventDefault()
                                        setEditBlock({ type: "header", content: values.document_header ?? "" })
                                    }}>{`${intl.formatMessage({ id: haveHeader ? "BUTTON.EDIT" : "BUTTON.APPEND" })} ${intl.formatMessage({ id: "DOCUMENTS.HEADER" })}`}</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={(event) => {
                                        event.preventDefault()
                                        setEditBlock({ type: "footer", content: values.document_footer ?? "" })
                                    }}>{`${intl.formatMessage({ id: haveFooter ? "BUTTON.EDIT" : "BUTTON.APPEND" })} ${intl.formatMessage({ id: "DOCUMENTS.FOOTER" })}`}</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={(event) => {
                                        event.preventDefault()
                                        handlePrintContent({ header: values.document_header, body: values.document_body, footer: values.document_footer })
                                    }}> {intl.formatMessage({ id: "BUTTON.PRINT" })}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </ComponentDashboard> */}
                        <div className="moduleDocuments_block card">
                            <div className="card-body">
                                <Form.Group className="moduleDocuments_field" as={Col} md={12}>
                                    <ComponentTooltip title={intl.formatMessage({ id: "DOCUMENTS.TITLE_LABEL" })}>
                                        <label className="moduleDocuments_fieldLabel required">
                                            {intl.formatMessage({ id: "DOCUMENTS.TITLE_LABEL" })}
                                        </label>
                                    </ComponentTooltip>
                                    <ComponentInput article="title" field_type="string" />
                                </Form.Group>
                                {/*
                                --- Привязка к объекту. Отключена 
                                 */}
                                {/*  <Form.Group className="moduleDocuments_field" as={Col} md={12}>
                                    <ComponentTooltip title={intl.formatMessage({ id: "DOCUMENTS.BIND_TO_LABEL" })}>
                                        <label className="moduleDocuments_fieldLabel required">
                                            {intl.formatMessage({ id: "DOCUMENTS.BIND_TO_LABEL" })}
                                        </label>
                                    </ComponentTooltip>
                                    <ComponentSelect article="object" data_type="string" list={objectsForBindList} />
                                </Form.Group> */}
                            </div>
                        </div>
                        {Array.isArray(fields_list) ? <div className="moduleDocuments_block card">
                            <div className="card-body">
                                {fields_list.map(field => <Form.Group key={field.article} className="moduleDocuments_field" as={Col} md={12}>
                                    <ComponentTooltip title={field.title ?? ""}>
                                        <label className="moduleDocuments_fieldLabel">{field.title}</label>
                                    </ComponentTooltip>
                                    <Component {...field} />
                                </Form.Group>)}
                            </div>
                        </div> : null}
                        <div className="moduleDocuments_block card">
                            <div className="card-body">
                                {!isVariablesLoading ? <ComponentTextEditor article="document_body" variables={variables.variables} tableVariables={variables.tableVariables} /> : null}
                            </div>
                        </div>
                        <Modal show={Boolean(editBlock)} onHide={() => setEditBlock(null)} size="xl" onEntering={setModalIndex}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {`${intl.formatMessage({ id: editBlock?.content ? "MODAL.EDIT_TITLE" : "MODAL.APPEND_TITLE" })} ${intl.formatMessage({ id: editBlock?.type === "header" ? "DOCUMENTS.MODAL_HEADER_TITLE" : "DOCUMENTS.MODAL_FOOTER_TITLE" })}`}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Formik initialValues={{ content: editBlock?.content ?? "" }} onSubmit={handleSubmitBlockForm}>
                                    {({ handleSubmit }) => <FormikForm>
                                        <div className="moduleDocuments_field">
                                            <ComponentTextEditor article="content" variables={variables.variables} tableVariables={variables.tableVariables} />
                                        </div>
                                        <ComponentDashboard inverse>
                                            <ComponentButton
                                                type="submit"
                                                settings={{ title: intl.formatMessage({ id: editBlock?.content ? "BUTTON.EDIT" : "BUTTON.APPEND" }), background: "dark", icon: "" }}
                                                customHandler={handleSubmit}
                                            />
                                        </ComponentDashboard>
                                    </FormikForm>}
                                </Formik>
                            </Modal.Body>
                        </Modal>
                    </FormikForm>
                }
            }
        </Formik>
    </div>
}

export default ModuleDocuments





