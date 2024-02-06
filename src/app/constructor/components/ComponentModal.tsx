import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Modal } from "react-bootstrap"
import useItem from "../../api/hooks/useItem"
import { isEqual } from "lodash"
import PageBuilder from "../../page/PageBuilder"
import { ModalContext } from "../modules/ModuleSchedule/ModuleSchedule"
import setModalIndex from "../helpers/setModalIndex"


type TComponentModal = {
    page?: string | null,
    show: boolean | { [key: string]: any } | null,
    setShow: (value: null | false) => void,
    refresh?: () => void,
    size?: "sm" | "lg" | "xl"
    centered?: boolean
}
type TContext = {
    setShow: TComponentModal["setShow"],
    initialData: { [key: string]: any },
    insideModal: boolean,
    saveInStorage: boolean
}
const ComponentModal: React.FC<TComponentModal> = ({ page, show, size = "xl", centered = false, setShow, refresh }) => {

    const handleClose = useCallback((value: any) => {
        if (refresh) {
            refresh()
        }
        setShow(false)
    }, [setShow, refresh])

    const [context, setContext] = useState<TContext>({ setShow: handleClose, initialData: {}, insideModal: true, saveInStorage: false  })
    useEffect(() => {
        if (show && typeof show === "object") {
            setContext(prev => isEqual(prev.initialData, show) ? prev : { ...prev, initialData: show })
        }
    }, [show])
                      
    const resolvedRequestProps = useMemo(() => Object.assign({ page }, show && typeof show === "object" ? { context: show } : {}), [page])

    const { data, isFetching } = useItem("pages", resolvedRequestProps, Boolean(page))

    return <Modal
        size={size}
        dialogClassName="customModal"
        show={Boolean(show) && Boolean(data)}
        onHide={() => setShow(null)}
        onEntering={setModalIndex}
        centered={centered}
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