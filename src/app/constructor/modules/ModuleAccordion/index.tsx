import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Accordion, AccordionContext, Card, Modal, useAccordionButton } from "react-bootstrap"
import parse from "html-react-parser"
import ComponentButton from "../../components/ComponentButton"
//@ts-ignore
import { default as printer } from 'print-html-element';
import useMutate from "../../../api/hooks/useMutate"
import { useIntl } from "react-intl"
import { Formik, Form as FormikForm } from "formik"
import ComponentTextEditor from "../../components/ComponentTextEditor"
import setModalIndex from "../../helpers/setModalIndex"
import { unescape } from "lodash"
import { Pagination } from "../ModuleList/src/Pagination"
import useListData from "../../../api/hooks/useListData"
import { TModuleAccordion, TModuleAccordionItem } from "./_types"
import ComponentDashboard from "../../components/ComponentDashboard";
import { Document, Page, pdfjs } from "react-pdf";
import { ModuleContext } from "../helpers/useModuleContent";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
//@ts-ignore
import worker from "pdfjs-dist/build/pdf.worker.entry"

pdfjs.GlobalWorkerOptions.workerSrc = worker;

const AccordionView: React.FC<{ view: string, body?: string, href?: string }> = ({ view, body, href }) => {
    const [numPages, setNumPages] = useState<number>();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    switch (view) {
        case "native":
            return <div>{parse(unescape(body))}</div>
        case "pdf":
            return <div className="moduleAccordion_itemPreview pdf">
                <Document file={href} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page scale={1.4} key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                </Document>
            </div>
        case "image":
            return <div className="moduleAccordion_itemPreview image"><img src={href} /></div>
        default:
            return <div className="moduleAccordion_itemPreview default">
                <span>Предварительный просмотр недоступен, пожалуйста, перейдите по <a href={href} target="_blank">ссылке</a></span>
            </div>
    }
}

const AccordionItem: React.FC<TModuleAccordionItem> = ({ id, title, body, href, user_id, mutate, handleEdit }) => {
    const intl = useIntl()
    const eventKey = String(id)
    const { activeEventKey } = useContext(AccordionContext)
    const isCurrentEventKey = activeEventKey === eventKey;

    const handleAccordionToggle = useAccordionButton(eventKey)
    const handleTitleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        return event.target instanceof Element && !event.target.closest(".componentButton") ? handleAccordionToggle(event) : null
    }
    const handlePrint = () => printer.printHtml(unescape(body))
    const handleDelete = () => mutate({ id })

    const view = useMemo(() => {
        if (body) {
            return "native"
        } else if (href) {
            if (href.includes("pdf")) {
                return "pdf"
            } else if (href.includes("jpg") || href.includes("jpeg") || href.includes("png")) {
                return "image"
            }
        }
        return "link"
    }, [body, href])

    return <Card className="moduleAccordion_item">
        <Card.Header className={`moduleAccordion_itemHeader${isCurrentEventKey ? " active" : ""}`} onClick={handleTitleClick}>
            <Card.Title className="moduleAccordion_itemTitle">
                {`${title}${user_id ? ` - ${user_id.title}` : ""}`}
            </Card.Title>
            <div className="moduleAccordion_itemButtons">
                {
                    body ? <>
                        <ComponentButton
                            type="custom"
                            settings={{ title: intl.formatMessage({ id: "BUTTON.EDIT" }), icon: "edit", background: "light" }}
                            defaultLabel="icon"
                            customHandler={() => handleEdit({ id, body })} />
                        <ComponentButton
                            type="custom"
                            settings={{ title: intl.formatMessage({ id: "BUTTON.PRINT" }), icon: "print", background: "light" }}
                            defaultLabel="icon"
                            customHandler={handlePrint} />
                    </> : null
                }
                <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "BUTTON.DELETE" }), icon: "trash", background: "light", attention_modal: true }}
                    defaultLabel="icon"
                    customHandler={handleDelete}
                />
            </div>
        </Card.Header>
        <Accordion.Collapse eventKey={eventKey}>
            <Card.Body className="moduleAccordion_itemBody">
                <AccordionView view={view} body={body} href={href} />
            </Card.Body>
        </Accordion.Collapse>
    </Card>
}

const ModuleAccordion: React.FC<TModuleAccordion> = ({ settings, components }) => {
    const intl = useIntl()
    const { object, property_title, property_body, filters } = settings
    const initialFilters = Object.assign({ select: ["title", "body", "user_id"] }, filters ?? {})
    const [filter, setFilter] = useState<{ page: number, limit: number }>({ page: 1, limit: 20 })
    const { data, refetch } = useListData(object, Object.assign(filter, initialFilters))
    const { mutate, isSuccess } = useMutate(object, "remove")
    const { mutate: updateItem, isSuccess: isUpdateSuccess } = useMutate(object, "update")
    const [editableItem, setEditableItem] = useState<{ id: number, body: string } | null>(null)

    const handleEdit = useCallback((document: { id: number, body: string }) => setEditableItem(document), [])

    const showPagination = data?.data.length
    const haveButtons = Boolean(components?.buttons)

    useEffect(() => {
        if (isSuccess || isUpdateSuccess) {
            setEditableItem(null)
            refetch()
        }
    }, [isSuccess, isUpdateSuccess])

    const contextValue = useMemo(() => ({
        refresh: refetch
    }), [])

    return <ModuleContext.Provider value={contextValue}>
        <ComponentDashboard>
            {haveButtons ? components.buttons.map(button => <ComponentButton key={button.settings.title} {...button} />) : null}
        </ComponentDashboard>
        <div className="moduleAccordion">
            <Accordion>
                {data?.data.map(document => <AccordionItem
                    key={document.id}
                    id={document.id}
                    title={document[property_title]}
                    body={document[property_body]}
                    href={document.href}
                    user_id={document.user_id}
                    mutate={mutate}
                    handleEdit={handleEdit}
                />)}
            </Accordion>
            {showPagination ? <Pagination detail={data?.detail} filter={filter} setFilter={setFilter} /> : null}

            <Modal show={Boolean(editableItem)} onHide={() => setEditableItem(null)} size="xl" onEntering={setModalIndex}>
                <Modal.Header>
                    <Modal.Title>
                        {intl.formatMessage({ id: "MODAL.EDIT_TITLE" })}
                    </Modal.Title>
                </Modal.Header>
                <Formik initialValues={editableItem ?? {}} onSubmit={values => updateItem(values)}>
                    {({ handleSubmit }) => <FormikForm>
                        <Modal.Body>
                            <ComponentTextEditor article="body" />
                        </Modal.Body>
                        <Modal.Footer>
                            <ComponentButton
                                type="submit"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.CANCEL" }), icon: "", background: "light" }}
                                customHandler={() => setEditableItem(null)} />
                            <ComponentButton
                                type="submit"
                                settings={{ title: intl.formatMessage({ id: "BUTTON.SUBMIT" }), icon: "", background: "dark" }}
                                customHandler={handleSubmit} />
                        </Modal.Footer>
                    </FormikForm>
                    }
                </Formik>
            </Modal>
        </div>
    </ModuleContext.Provider>
}

export default ModuleAccordion