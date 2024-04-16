import React, { useEffect, useMemo, useState } from "react"
import useDomRu from "../../api/hooks/useDomRu"
import { useAuth } from "../../modules/auth"
import api from "../../api"
import { Modal } from "react-bootstrap"
import useItem from "../../api/hooks/useItem"
import PageBuilder from "../../page/PageBuilder"
import { ModalContext } from "./ModuleSchedule"
import ComponentButton from "../components/ComponentButton"
import { KTSVG } from "../../../_metronic/helpers"
import setModalIndex from "../helpers/setModalIndex"
import SplashScreen from "../helpers/SplashScreen"


const ModuleDomRu: React.FC = () => {
    const { currentUser } = useAuth()
    const { data, refetch } = useDomRu()
    const isActiveCall = data && typeof data !== "boolean"
    const isActiveCallWithPage = isActiveCall && data.type === "page"
    const pageRequestData = isActiveCallWithPage ? { page: data.value.slice(1) } : {}
    const [notificated, setNotificated] = useState(false)
    const [show, setShow] = useState(false)
    const { data: pageData, isFetching } = useItem("pages", pageRequestData, Boolean(isActiveCallWithPage))

    useEffect(() => {
        if (isActiveCall && !notificated) {
            setShow(true)
        } else {
            setShow(false)
        }
    }, [isActiveCall, notificated])


    const handleHideModal = () => {
        setNotificated(true)
        setShow(false)
    }


    const handleCloseCall = async () => {
        if (isActiveCall) {
            await api("dom_ru", "close_modal", { user_id: currentUser?.id, phone: isActiveCallWithPage ? data.phone : data.value })
            setShow(false)
            await refetch()
            setNotificated(false)
        }
    }

    const modalSize = isActiveCallWithPage ? "xl" : "sm"
    /*
    setShow - временная заглушка. Нужно переделать логику 
     */
    const modalContext = useMemo(() => {
        if (isActiveCallWithPage) {
            const splitedLink = data.value.split("/")
            const id = splitedLink[splitedLink.length - 1]
            return { initialData: { id }, setShow: () => { } }
        }
        else {
            return {}
        }
    }, [data])
    return <div className="app-navbar-item ms-1 ms-lg-3">
        {
            isActiveCall ? <button className="moduleDomRu_button" onClick={() => setShow(true)}>
                <KTSVG path='/media/crm/icons/phone.svg' className="svg-icon-1" />
            </button> : null
        }

        <ModalContext.Provider value={modalContext}>
            <Modal dialogClassName="customModal" show={show} size={modalSize} onHide={handleHideModal} onEntering={setModalIndex}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Входящий звонок
                    </Modal.Title>
                    <ComponentButton type="custom" settings={{ title: "Завершить звонок", background: "dark", icon: "" }} customHandler={handleCloseCall} />
                </Modal.Header>
                <Modal.Body style={{ minHeight: "300px" }}>
                    {
                        isActiveCall ? isActiveCallWithPage ? pageData ?
                            <PageBuilder data={pageData} isFetching={isFetching} showProgressBar={false} /> :
                            <SplashScreen className="default" active /> :
                            `Входящий звонок: ${data.value}` :
                            null
                    }
                </Modal.Body>
            </Modal>
        </ModalContext.Provider>
    </div>
}


export default ModuleDomRu