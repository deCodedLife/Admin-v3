import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSetupContext } from "../../../helpers/SetupContext"
import { useAuth } from "../../../../modules/auth"
import { useIntl } from "react-intl"
import useRequest from "../../../../api/hooks/useRequest"
import moment from "moment"
import api from "../../../../api"
import { autocompleteDocument } from "../../helpers"
//@ts-ignore
import { default as printer } from 'print-html-element';
import { getErrorToast } from "../../../helpers/toasts"
import ComponentTooltip from "../../ComponentTooltip"
import ComponentButton, { getLabel } from ".."
import { Col, Form, Modal } from "react-bootstrap"
import setModalIndex from "../../../helpers/setModalIndex"
import { Formik, Form as FormikForm } from "formik"
import ComponentSelect from "../../ComponentSelect"
import ComponentTextEditor from "../../ComponentTextEditor"
import { useFormContext } from "../../../modules/ModuleForm"
import { ModalContext } from "../../../modules/ModuleSchedule"
import { TComponentButtonPrint } from "../_types"


type Tdocument = { title: string, article: string, object?: string, structure: Array<{ block_type: string, settings: { document_body: string } }> }

const ComponentButtonPrint: React.FC<TComponentButtonPrint> = ({ settings, defaultLabel = "title", className = "" }) => {
    const ref = useRef<HTMLButtonElement | null>(null)
    const { context: applicationContext } = useSetupContext()
    const { currentUser } = useAuth()
    const intl = useIntl()
    const { data, context, visible = true, afterSubmit = false } = settings
    const { is_edit, row_id, scheme_name, document_article, script } = data
    const resolvedContext = Object.assign({ block: "print" }, context ?? {})
    const { data: documents } = useRequest<Array<Tdocument>>("documents", "get", { context: resolvedContext })
    const [showEditModal, setShowEditModal] = useState(false)
    const [isMinimize, setIsMinimize] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [currentDocument, setCurrentDocument] = useState<string | null>(null)
    const isIconBased = defaultLabel === "icon"
    const { isSuccess } = useFormContext()

    //проверка на нахождение внутри другого модального окна
    const outterModalContext = React.useContext(ModalContext)
    const insideOutterModal = Boolean(outterModalContext.insideModal)

    const handleScriptAction = useCallback(async (title: string, body: string) => {
        if (script) {
            try {
                const resolvedTitle = `${title} (${moment().format("DD.MM.YY г.")})`
                const requestData = Object.assign({}, { title: resolvedTitle, body }, script.properties ?? {})
                await api(script.object, script.command, requestData)
            } catch (error) {
                //@ts-ignore
                getErrorToast(error.message)
            }
        }
    }, [script])

    useEffect(() => {
        if (isSuccess && afterSubmit) {
            ref.current?.click()
        }
    }, [isSuccess])


    const handleMinimize = () => {
        setIsMinimize(true)
        if (!insideOutterModal) {
            document.body.setAttribute("style", "padding-right: 4px")
        }
    }

    const handleClick = async () => {
        if (isMinimize) {
            setIsMinimize(false)
            if (!insideOutterModal) {
                document.body.setAttribute("style", "overflow: hidden; padding-right: 4px")
            }
        } else {
            const documentsResponse = document_article ? await api<Array<Tdocument>>("documents", "get", { article: document_article }) : null
            const documentFromResponse = documentsResponse ? documentsResponse.data[0] : null
            const document = documentFromResponse ? await autocompleteDocument(documentFromResponse, row_id, scheme_name, currentUser, applicationContext) : null
            if (is_edit) {
                setShowEditModal(true)
                return setCurrentDocument(document ?? "")
            } else {
                if (documentFromResponse && document) {
                    printer.printHtml(document)
                    handleScriptAction(documentFromResponse.title, document)
                } else {
                    getErrorToast(intl.formatMessage({ id: "BUTTON_PRINT.DOCUMENT_ERROR" }))
                }
            }
        }
    }

    const handleSelect = async (label: { label: string, value: string } | null, setFieldValue: (article: string, value: any) => void) => {
        setIsLoading(true)
        if (label && label.value) {
            const documentsResponse = await api<Array<Tdocument>>("documents", "get", { article: label.value })
            const documentFromResponse = documentsResponse ? documentsResponse.data[0] : null
            const document = documentFromResponse ? await autocompleteDocument(documentFromResponse, row_id, scheme_name, currentUser, applicationContext) : null
            setFieldValue("documentContent", document ?? "")
            setFieldValue("selectedDocumentTitle", documentFromResponse?.title ?? "")
        }
        setFieldValue("selectedDocument", label?.value ?? null)
        setIsLoading(false)
    }

    const handleSubmit = (values: { selectedDocumentTitle: string, documentContent: string }) => {
        printer.printHtml(values.documentContent)
        handleScriptAction(values.selectedDocumentTitle, values.documentContent)
    }

    const initialValues = useMemo(() => ({ selectedDocument: null, selectedDocumentTitle: "", documentContent: currentDocument ?? "" }), [currentDocument])
    const documentsList = useMemo(() => documents && Array.isArray(documents) ? documents.map(document => ({ title: document.title, value: document.article })) : [], [documents])
    const resolvedClassName = `componentButton${isIconBased ? " icon_based" : ""} ${className} ${settings.background} ${isMinimize ? " minimized" : ""} ${visible ? "" : " hidden"}`
    return <>
        <ComponentTooltip title={settings.title ?? ""} show={isIconBased ? undefined : false}>
            <button
                ref={ref}
                className={resolvedClassName}
                type="button"
                onClick={handleClick}>
                {getLabel(defaultLabel, settings)}
            </button>

        </ComponentTooltip>

        <Modal
            size="xl"
            className={isMinimize ? " hidden" : ""}
            dialogClassName="componentButton_modal"
            backdropClassName={isMinimize ? "hidden" : ""}
            show={showEditModal}
            onEntering={setModalIndex}
            onHide={handleMinimize}
        >
            <Modal.Header>
                <Modal.Title>
                    {intl.formatMessage({ id: "BUTTON_PRINT.MODAL_TITLE" })}
                </Modal.Title>
                <button type="button" className="componentButton_modalButton modalMinimize" onClick={handleMinimize}>-</button>
                <button type="button" className="componentButton_modalButton modalClose" onClick={() => setShowEditModal(false)}>x</button>
            </Modal.Header>
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                {({ setFieldValue, handleSubmit, values }) => <FormikForm>
                    <Modal.Body className="d-flex flex-wrap align-items-center justify-content-end">
                        {!currentDocument ? <Form.Group className="my-4" as={Col} md={11}>
                            <ComponentSelect
                                article="selectedDocument"
                                data_type="string"
                                list={documentsList}
                                placeholder={intl.formatMessage({ id: "BUTTON_PRINT.SELECT_PLACEHOLDER" })}
                                customHandler={(value) => handleSelect(value, setFieldValue)}
                                isLoading={isLoading}
                            />
                        </Form.Group> : null}
                        <Form.Group className="d-flex justify-content-center my-4" as={Col} md={1}>
                            <ComponentButton
                                type="custom"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.SUBMIT" }), background: "dark", icon: "print" }}
                                customHandler={handleSubmit}
                                defaultLabel="icon"
                            />
                        </Form.Group>
                        {values.documentContent ? <Form.Group as={Col} md={12}>
                            <ComponentTextEditor article="documentContent" />
                        </Form.Group> : null}
                    </Modal.Body>
                </FormikForm>}
            </Formik>
        </Modal>
    </>
}

export default ComponentButtonPrint