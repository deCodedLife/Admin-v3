import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Modal } from "react-bootstrap"
import useItem from "../../../api/hooks/useItem"
import { isEqual } from "lodash"
import PageBuilder from "../../../pages/PageBuilder"
import { ModalContext } from "../../modules/ModuleSchedule"
import setModalIndex from "../../helpers/setModalIndex"
import { TComponentModal, TContext } from "./_types"
import { useLocation, useNavigate } from "react-router-dom"
import usePrevious from "../../helpers/usePrevious"

const ComponentModal: React.FC<TComponentModal> = ({ page, show, size = "xl", centered = false, setShow, refresh }) => {
    const navigate = useNavigate()
    const location = useLocation()
    //если модалка находится внутри другой модалки, то не сохранять фильтры 
    const outterModalContext = React.useContext(ModalContext)
    const isModalInsideModal = Boolean(outterModalContext.insideModal)
    const saveInStorage = !isModalInsideModal

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

    //нужно хранить страницу, т.к. onExited срабатывает уже после того, как page становится "falsy"
    const pageForExitedHandler = usePrevious(page)

    return <Modal
        size={size}
        dialogClassName="customModal"
        show={Boolean(show) && Boolean(data)}
        onHide={() => setShow(null)}
        onEntering={setModalIndex}
        onEntered={() => {
            const resolvedPath = isModalInsideModal && location.search ? location.search + `&modal=${page}` : `?modal=${page}`
            navigate(resolvedPath)
        }}
        onExited={() => {
            const regex = new RegExp(`${isModalInsideModal ? `&modal=${pageForExitedHandler}` : `\\?modal=${pageForExitedHandler}`}.*`)
            const resolvedPath = location.pathname + location.search.replace(regex, "")
            navigate(resolvedPath)
        }}
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