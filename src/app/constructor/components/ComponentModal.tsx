import React, { useCallback, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import useItem from "../../api/hooks/useItem"
import { isEqual } from "lodash"
import PageBuilder from "../../page/PageBuilder"
import { ModalContext } from "../modules/ModuleSchedule/ModuleSchedule"
import setModalIndex from "../helpers/setModalIndex"


type TComponentModal = { 
    page?: string,
      show: boolean | { [key: string]: any } | null,
      setShow: (value: null | false) => void, refresh: () => void,
      size?: "sm" | "lg" | "xl"
    }
type TContext = {
    setShow: TComponentModal["setShow"],
    initialData: { [key: string]: any },
    insideModal: boolean
}
const ComponentModal: React.FC<TComponentModal> = ({ page, show, size = "xl", setShow, refresh }) => {

    const handleClose = useCallback((value: any) => {
        if (refresh) {
            refresh()
        }
        setShow(false)
    }, [setShow, refresh])

    const [context, setContext] = useState<TContext>({ setShow: handleClose, initialData: {}, insideModal: true })
    useEffect(() => {
        if (show && typeof show === "object") {
            setContext(prev => isEqual(prev.initialData, show) ? prev : { ...prev, initialData: show })
        }
    }, [show])

    const { data, isFetching } = useItem("pages", { page }, Boolean(page))

    return <Modal
        size={size}
        dialogClassName="customModal"
        show={Boolean(show) && Boolean(data)}
        onHide={() => setShow(null)}
        onEntering={setModalIndex}
    >
        <Modal.Header closeButton className="modal-emptyHeader" />
        <Modal.Body className="scroll-y">
            <ModalContext.Provider value={context}>
                {data ? <PageBuilder data={data} isFetching={isFetching} showProgressBar={false} /> : null}
            </ModalContext.Provider>

        </Modal.Body>
    </Modal>
}

export default ComponentModal