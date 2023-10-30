import { useField } from "formik"
import React, { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import usePrevious from "../../helpers/usePrevious"
import parse from "html-react-parser"
import setModalIndex from "../../helpers/setModalIndex"


const InfoModal: React.FC = () => {
    const [content, setContent] = useState<string | null>(null)
    const [field] = useField("modal_info")
    const {value} = field
    const previousFieldValue = usePrevious(value)
    
    useEffect(() => {
        if (Array.isArray(value) && value.length) {
            if ((Array.isArray(previousFieldValue) && previousFieldValue.length < value.length) || !previousFieldValue) {
                setContent(value[value.length - 1])
            }
        }
    }, [value])
    return <Modal show={Boolean(content)} onHide={() => setContent(null)} size="xl" onEntering={setModalIndex}>
        <Modal.Header closeButton>
            <Modal.Title>
            Информационное окно
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {parse(content ?? "")}
        </Modal.Body>
    </Modal>
}

export default InfoModal