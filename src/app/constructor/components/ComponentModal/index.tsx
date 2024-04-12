import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Modal } from "react-bootstrap"
import useItem from "../../../api/hooks/useItem"
import { isEqual } from "lodash"
import PageBuilder from "../../../page/PageBuilder"
import { ModalContext } from "../../modules/ModuleSchedule/ModuleSchedule"
import setModalIndex from "../../helpers/setModalIndex"
import { TComponentModal, TContext } from "./_types"

const ComponentModal: React.FC<TComponentModal> = ({ page, show, size = "xl", centered = false, setShow, refresh }) => {

    //если модалка находится внутри другой модалки, то не сохранять фильтры 
    const outterModalContext = React.useContext(ModalContext)
    const saveInStorage = !(outterModalContext.insideModal)

    const handleClose = useCallback((value: any) => {
        if (refresh) {
            refresh()
        }
        setShow(false)
    }, [setShow, refresh])


    const resolvedRequestProps = useMemo(() => Object.assign({ page }, show && typeof show === "object" ? { context: show } : {}), [page])
    const { data, isFetching, refetch } = useItem("pages", resolvedRequestProps, Boolean(page))


    const [context, setContext] = useState<TContext>({ setShow: handleClose, refetchPage: refetch, initialData: {}, insideModal: true, saveInStorage })
    useEffect(() => {
        if (show && typeof show === "object") {
            setContext(prev => isEqual(prev.initialData, show) ? prev : { ...prev, initialData: show })
        }
    }, [show])

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