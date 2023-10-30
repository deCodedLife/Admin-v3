import React, { useCallback, useContext, useEffect, useState } from "react"
import { ModuleAccordionItemType, ModuleAccordionType } from "../../types/modules"
import useItem from "../../api/hooks/useItem"
import { Accordion, AccordionContext, Card, Modal, useAccordionButton } from "react-bootstrap"
import parse from "html-react-parser"
import ComponentButton from "../components/ComponentButton"
//@ts-ignore
import { default as printer } from 'print-html-element';
import useMutate from "../../api/hooks/useMutate"
import { useIntl } from "react-intl"
import { Formik, Form as FormikForm } from "formik"
import ComponentTextEditor from "../components/ComponentTextEditor"
import setModalIndex from "../helpers/setModalIndex"
import { unescape } from "lodash"


const AccordionItem: React.FC<ModuleAccordionItemType> = ({ id, title, body, user_id, mutate, handleEdit }) => {
    const intl = useIntl()
    const eventKey = String(id)
    const { activeEventKey } = useContext(AccordionContext)
    const isCurrentEventKey = activeEventKey === eventKey;

    const handleAccordionToggle = useAccordionButton(eventKey)
    const handleTitleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        return event.target instanceof Element && !event.target.closest(".componentButton") ? handleAccordionToggle(event) : null
    }
    const handlePrint = () => printer.printHtml(body)
    const handleDelete = () => mutate({ id })

    return <Card className="moduleAccordion_item">
        <Card.Header className={`moduleAccordion_itemHeader${isCurrentEventKey ? " active" : ""}`} onClick={handleTitleClick}>
            <Card.Title className="moduleAccordion_itemTitle">
                {`${title}${user_id ? ` - ${user_id.title}` : ""}`}
            </Card.Title>
            <div className="moduleAccordion_itemButtons">
            <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({id: "BUTTON.EDIT"}), icon: "edit", background: "light" }}
                    defaultLabel="icon"
                    customHandler={() => handleEdit({id, body})} />
                <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({id: "BUTTON.PRINT"}), icon: "print", background: "light" }}
                    defaultLabel="icon"
                    customHandler={handlePrint} />
                <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({id: "BUTTON.DELETE"}), icon: "trash", background: "light", attention_modal: true }}
                    defaultLabel="icon"
                    customHandler={handleDelete}
                />
            </div>
        </Card.Header>
        <Accordion.Collapse eventKey={eventKey}>
            <Card.Body className="moduleAccordion_itemBody">
                {parse(unescape(body))}
            </Card.Body>
        </Accordion.Collapse>
    </Card>
}

const ModuleAccordion: React.FC<ModuleAccordionType> = ({ settings }) => {
    const intl = useIntl()
    const { object, property_title, property_body, filters } = settings
    const resolvedFilter = Object.assign({ select: ["title", "body", "user_id"] }, filters ?? {})
    const { data, refetch } = useItem(object, resolvedFilter)
    const { mutate, isSuccess } = useMutate(object, "remove")
    const {mutate: updateItem, isSuccess: isUpdateSuccess} = useMutate(object, "update")
    const [editableItem, setEditableItem] = useState<{id: number, body: string} | null>(null)

    const handleEdit = useCallback((document: {id: number, body: string}) => setEditableItem(document), [])

    useEffect(() => {
        if (isSuccess || isUpdateSuccess) {
            setEditableItem(null)
            refetch()
        }
    }, [isSuccess, isUpdateSuccess])


    return <div className="moduleAccordion">
        <Accordion>
            {data?.map(document => <AccordionItem
                key={document.id}
                id={document.id}
                title={document[property_title]}
                body={document[property_body]}
                user_id={document.user_id}
                mutate={mutate}
                handleEdit={handleEdit}
            />)}
        </Accordion>
        <Modal show={Boolean(editableItem)} onHide={() => setEditableItem(null)} size="xl" onEntering={setModalIndex}>
            <Modal.Header>
                <Modal.Title>
                    {intl.formatMessage({id: "MODAL.EDIT_TITLE"})}
                </Modal.Title>
            </Modal.Header>
                <Formik initialValues={editableItem ?? {}} onSubmit={values => updateItem(values)}>
                    {({handleSubmit}) => <FormikForm>
                        <Modal.Body>
                        <ComponentTextEditor article="body" />
                        </Modal.Body>
                    <Modal.Footer>
                    <ComponentButton
                     type="submit"
                     settings={{title: intl.formatMessage({id: "BUTTON.CANCEL"}), icon: "", background: "light"}}
                      customHandler={() => setEditableItem(null)} />
                        <ComponentButton 
                        type="submit"
                         settings={{title: intl.formatMessage({id: "BUTTON.SUBMIT"}), icon: "", background: "dark"}} 
                         customHandler={handleSubmit} />
                    </Modal.Footer>
                        </FormikForm>
                        }
                </Formik>
        </Modal>
    </div>
}

export default ModuleAccordion